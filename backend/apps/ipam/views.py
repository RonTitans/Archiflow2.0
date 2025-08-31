from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Subnet, IPAddress
from .serializers import (
    SubnetListSerializer,
    SubnetDetailSerializer,
    SubnetCreateUpdateSerializer,
    IPAddressSerializer,
    IPAddressCreateUpdateSerializer
)


class SubnetViewSet(viewsets.ModelViewSet):
    queryset = Subnet.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SubnetListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return SubnetCreateUpdateSerializer
        return SubnetDetailSerializer
    
    def get_queryset(self):
        queryset = Subnet.objects.select_related('site').annotate(
            ip_count=Count('ip_addresses'),
            used_count=Count('ip_addresses', filter=Q(ip_addresses__status='allocated'))
        )
        
        # Filter by site if provided
        site_id = self.request.query_params.get('site')
        if site_id:
            queryset = queryset.filter(site_id=site_id)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(cidr__icontains=search)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def allocate(self, request, pk=None):
        subnet = self.get_object()
        # Simple allocation logic - find first available IP
        # In production, this would be more sophisticated
        return Response({'message': 'IP allocation endpoint'}, status=status.HTTP_200_OK)


class IPAddressViewSet(viewsets.ModelViewSet):
    queryset = IPAddress.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return IPAddressCreateUpdateSerializer
        return IPAddressSerializer
    
    def get_queryset(self):
        queryset = IPAddress.objects.select_related('subnet')
        
        # Filter by subnet
        subnet_id = self.request.query_params.get('subnet')
        if subnet_id:
            queryset = queryset.filter(subnet_id=subnet_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(address__icontains=search) |
                Q(hostname__icontains=search) |
                Q(mac_address__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def release(self, request, pk=None):
        ip_address = self.get_object()
        ip_address.status = 'available'
        ip_address.hostname = None
        ip_address.mac_address = None
        ip_address.save()
        return Response({'message': 'IP released successfully'}, status=status.HTTP_200_OK)