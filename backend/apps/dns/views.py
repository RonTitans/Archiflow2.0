from rest_framework import viewsets, permissions
from django.db.models import Count, Q
from .models import DNSZone, DNSRecord
from .serializers import (
    DNSZoneListSerializer,
    DNSZoneDetailSerializer,
    DNSZoneCreateUpdateSerializer,
    DNSRecordSerializer,
    DNSRecordCreateUpdateSerializer
)


class DNSZoneViewSet(viewsets.ModelViewSet):
    queryset = DNSZone.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DNSZoneListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return DNSZoneCreateUpdateSerializer
        return DNSZoneDetailSerializer
    
    def get_queryset(self):
        queryset = DNSZone.objects.annotate(
            record_count=Count('records')
        )
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset


class DNSRecordViewSet(viewsets.ModelViewSet):
    queryset = DNSRecord.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DNSRecordCreateUpdateSerializer
        return DNSRecordSerializer
    
    def get_queryset(self):
        queryset = DNSRecord.objects.select_related('zone')
        
        # Filter by zone
        zone_id = self.request.query_params.get('zone')
        if zone_id:
            queryset = queryset.filter(zone_id=zone_id)
        
        # Filter by type
        record_type = self.request.query_params.get('type')
        if record_type:
            queryset = queryset.filter(type=record_type)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(value__icontains=search)
            )
        
        return queryset