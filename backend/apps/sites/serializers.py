from rest_framework import serializers
from .models import Site
from apps.contacts.models import Contact
from apps.tenants.models import Tenant


class SiteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for site lists"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    group_display = serializers.CharField(source='get_group_display', read_only=True)
    primary_contact_name = serializers.CharField(source='primary_contact.name', read_only=True, allow_null=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Site
        fields = [
            'id', 'name', 'code', 'status', 'status_display',
            'city', 'country', 'region', 'region_display',
            'group', 'group_display', 'tenant', 'tenant_name',
            'description', 'primary_contact_name',
            'equipment_count', 'subnet_count', 'alert_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['equipment_count', 'subnet_count', 'alert_count']


class SiteDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all relationships"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    group_display = serializers.CharField(source='get_group_display', read_only=True)
    primary_contact_name = serializers.CharField(source='primary_contact.name', read_only=True, allow_null=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True, allow_null=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True, allow_null=True)
    
    # Statistics
    equipment_count = serializers.IntegerField(read_only=True)
    subnet_count = serializers.IntegerField(read_only=True) 
    alert_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Site
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class SiteCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating sites"""
    
    class Meta:
        model = Site
        fields = [
            'name', 'code', 'status', 'description',
            'address', 'city', 'state_province', 'postal_code', 'country',
            'region', 'latitude', 'longitude', 'time_zone',
            'group', 'tenant', 'facility_id', 'asn',
            'primary_contact', 'physical_address', 'shipping_address',
            'comments'
        ]
    
    def validate_code(self, value):
        """Ensure code is unique and uppercase"""
        value = value.upper()
        if self.instance:
            # Update case - exclude current instance
            if Site.objects.filter(code=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Site with this code already exists.")
        else:
            # Create case
            if Site.objects.filter(code=value).exists():
                raise serializers.ValidationError("Site with this code already exists.")
        return value