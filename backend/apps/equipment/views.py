from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Equipment, Interface
from .serializers import (
    EquipmentListSerializer,
    EquipmentDetailSerializer,
    EquipmentCreateUpdateSerializer,
    InterfaceSerializer
)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EquipmentListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EquipmentCreateUpdateSerializer
        return EquipmentDetailSerializer
    
    def get_queryset(self):
        queryset = Equipment.objects.select_related('site').annotate(
            interface_count=Count('interfaces')
        )
        
        # Filter by site if provided
        site_id = self.request.query_params.get('site')
        if site_id:
            queryset = queryset.filter(site_id=site_id)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Equipment.objects.count()
        active = Equipment.objects.filter(status='active').count()
        by_type = Equipment.objects.values('device_type').annotate(count=Count('id'))
        
        return Response({
            'total_equipment': total,
            'active_equipment': active,
            'by_type': list(by_type)
        })


class InterfaceViewSet(viewsets.ModelViewSet):
    queryset = Interface.objects.all()
    serializer_class = InterfaceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Interface.objects.select_related('equipment')
        
        equipment_id = self.request.query_params.get('equipment')
        if equipment_id:
            queryset = queryset.filter(equipment_id=equipment_id)
        
        return queryset