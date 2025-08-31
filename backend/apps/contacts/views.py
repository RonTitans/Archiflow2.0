from rest_framework import viewsets, permissions
from django.db.models import Count, Q
from .models import Contact
from .serializers import (
    ContactSerializer,
    ContactCreateUpdateSerializer
)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ContactCreateUpdateSerializer
        return ContactSerializer
    
    def get_queryset(self):
        queryset = Contact.objects.all()
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(role__icontains=search)
            )
        
        return queryset