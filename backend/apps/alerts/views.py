from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from .models import Alert
from .serializers import (
    AlertSerializer,
    AlertUpdateSerializer
)


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return AlertUpdateSerializer
        return AlertSerializer
    
    def get_queryset(self):
        queryset = Alert.objects.select_related('equipment')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by severity
        severity = self.request.query_params.get('severity')
        if severity:
            queryset = queryset.filter(severity=severity)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(message__icontains=search) |
                Q(source__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'acknowledged'
        alert.acknowledged_by = request.user
        alert.acknowledged_at = timezone.now()
        alert.save()
        return Response({'message': 'Alert acknowledged'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'resolved'
        alert.resolved_by = request.user
        alert.resolved_at = timezone.now()
        alert.save()
        return Response({'message': 'Alert resolved'}, status=status.HTTP_200_OK)