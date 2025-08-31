from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Tenant, TenantGroup
from .serializers import TenantSerializer, TenantGroupSerializer

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

class TenantGroupViewSet(viewsets.ModelViewSet):
    queryset = TenantGroup.objects.all()
    serializer_class = TenantGroupSerializer
    permission_classes = [IsAuthenticated]