from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import ConfigTemplate, RenderedConfig
from .serializers import (
    ConfigTemplateListSerializer,
    ConfigTemplateDetailSerializer,
    ConfigTemplateCreateUpdateSerializer,
    RenderedConfigSerializer,
    RenderedConfigCreateUpdateSerializer
)


class ConfigTemplateViewSet(viewsets.ModelViewSet):
    queryset = ConfigTemplate.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ConfigTemplateListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ConfigTemplateCreateUpdateSerializer
        return ConfigTemplateDetailSerializer
    
    def get_queryset(self):
        queryset = ConfigTemplate.objects.annotate(
            backup_count=Count('configbackup')
        )
        
        # Filter by device type
        device_type = self.request.query_params.get('device_type')
        if device_type:
            queryset = queryset.filter(device_type=device_type)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        template = self.get_object()
        # Simple template application logic
        return Response({'message': 'Template application endpoint'}, status=status.HTTP_200_OK)


class RenderedConfigViewSet(viewsets.ModelViewSet):
    queryset = RenderedConfig.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RenderedConfigCreateUpdateSerializer
        return RenderedConfigSerializer
    
    def get_queryset(self):
        queryset = RenderedConfig.objects.select_related('equipment')
        
        # Filter by equipment
        equipment_id = self.request.query_params.get('equipment')
        if equipment_id:
            queryset = queryset.filter(equipment_id=equipment_id)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(notes__icontains=search) |
                Q(version__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        backup = self.get_object()
        # Simple restore logic
        return Response({'message': 'Config restore endpoint'}, status=status.HTTP_200_OK)