from rest_framework import serializers
from .models import Tenant, TenantGroup

class TenantGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantGroup
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    group_display = serializers.CharField(source='group.name', read_only=True)
    
    class Meta:
        model = Tenant
        fields = '__all__'