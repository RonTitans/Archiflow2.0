from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from django.db.models import Count, Q
from django.http import HttpResponse
import csv
import json
from .models import Site
from .serializers import (
    SiteListSerializer,
    SiteDetailSerializer,
    SiteCreateUpdateSerializer
)
from apps.contacts.models import Contact


class SiteFilter(filters.FilterSet):
    """Filter class for Site queries"""
    status = filters.ChoiceFilter(choices=Site.STATUS_CHOICES)
    region = filters.ChoiceFilter(choices=Site.REGION_CHOICES)
    group = filters.ChoiceFilter(choices=Site.GROUP_CHOICES)
    tenant = filters.CharFilter(field_name='tenant__id')
    name = filters.CharFilter(lookup_expr='icontains')
    code = filters.CharFilter(lookup_expr='iexact')
    city = filters.CharFilter(lookup_expr='icontains')
    country = filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Site
        fields = ['status', 'region', 'group', 'tenant', 'name', 'code', 'city', 'country']


class SiteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Site CRUD operations
    
    list: Get all sites (paginated)
    create: Create a new site
    retrieve: Get a specific site
    update: Update a site
    destroy: Delete a site
    stats: Get site statistics
    """
    queryset = Site.objects.select_related('primary_contact', 'tenant').all()
    permission_classes = [IsAuthenticated]
    filterset_class = SiteFilter
    search_fields = ['name', 'code', 'city', 'address', 'description']
    ordering_fields = ['name', 'code', 'created_at', 'updated_at', 'status', 'city', 'region']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return SiteListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return SiteCreateUpdateSerializer
        return SiteDetailSerializer
    
    def perform_create(self, serializer):
        """Set created_by when creating"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Set updated_by when updating"""
        serializer.save(updated_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get overall site statistics"""
        queryset = self.get_queryset()
        total = queryset.count()
        
        # Count by status
        status_counts = {}
        for choice, label in Site.STATUS_CHOICES:
            status_counts[choice] = queryset.filter(status=choice).count()
        
        # Count by region
        region_counts = {}
        for choice, label in Site.REGION_CHOICES:
            region_counts[choice] = queryset.filter(region=choice).count()
        
        # Count by group
        group_counts = {}
        for choice, label in Site.GROUP_CHOICES:
            group_counts[choice] = queryset.filter(group=choice).count()
        
        return Response({
            'total': total,
            'by_status': status_counts,
            'by_region': region_counts,
            'by_group': group_counts
        })
    
    @action(detail=True, methods=['get'])
    def site_stats(self, request, pk=None):
        """Get statistics for a specific site"""
        site = self.get_object()
        
        return Response({
            'equipment_count': site.equipment.count() if hasattr(site, 'equipment') else 0,
            'contact_count': site.contacts.count() if hasattr(site, 'contacts') else 0,
            'subnet_count': site.subnets.count() if hasattr(site, 'subnets') else 0,
            'alert_count': site.alerts.filter(status='active').count() if hasattr(site, 'alerts') else 0,
            'total_alerts': site.alerts.count() if hasattr(site, 'alerts') else 0,
        })
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Bulk delete sites"""
        ids = request.data.get('ids', [])
        if not ids:
            return Response(
                {'error': 'No IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        deleted_count = Site.objects.filter(id__in=ids).delete()[0]
        return Response({
            'deleted': deleted_count,
            'message': f'Successfully deleted {deleted_count} sites'
        })
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update sites"""
        ids = request.data.get('ids', [])
        updates = request.data.get('updates', {})
        
        if not ids or not updates:
            return Response(
                {'error': 'IDs and updates are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Only allow certain fields to be bulk updated
        allowed_fields = ['status', 'region', 'group', 'tenant']
        filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
        
        if not filtered_updates:
            return Response(
                {'error': 'No valid fields to update'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        updated_count = Site.objects.filter(id__in=ids).update(**filtered_updates)
        return Response({
            'updated': updated_count,
            'message': f'Successfully updated {updated_count} sites'
        })
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export sites to CSV"""
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="sites.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Name', 'Code', 'Status', 'City', 'Country', 'Region',
            'Group', 'Tenant', 'Description', 'Primary Contact',
            'Created At', 'Updated At'
        ])
        
        for site in queryset:
            writer.writerow([
                site.name,
                site.code,
                site.get_status_display(),
                site.city,
                site.country,
                site.get_region_display() if site.region else '',
                site.get_group_display() if site.group else '',
                site.tenant.name if site.tenant else '',
                site.description,
                site.primary_contact.name if site.primary_contact else '',
                site.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                site.updated_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response
    
    @action(detail=True, methods=['post'])
    def set_primary_contact(self, request, pk=None):
        """Set the primary contact for a site"""
        site = self.get_object()
        contact_id = request.data.get('contact_id')
        
        try:
            contact = site.contacts.get(id=contact_id)
            site.primary_contact = contact
            site.save()
            return Response({'status': 'primary contact set'})
        except Contact.DoesNotExist:
            return Response(
                {'error': 'Contact not found for this site'},
                status=status.HTTP_404_NOT_FOUND
            )