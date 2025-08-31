from rest_framework import serializers
from .models import Subnet, IPAddress


class IPAddressSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    subnet_name = serializers.CharField(source='subnet.cidr', read_only=True)
    
    class Meta:
        model = IPAddress
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class SubnetListSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    ip_count = serializers.IntegerField(read_only=True)
    used_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Subnet
        fields = ['id', 'cidr', 'vlan', 'description', 'site', 'site_name', 
                 'ip_count', 'used_count', 'created_at']


class SubnetDetailSerializer(serializers.ModelSerializer):
    ip_addresses = IPAddressSerializer(many=True, read_only=True)
    site_name = serializers.CharField(source='site.name', read_only=True)
    
    class Meta:
        model = Subnet
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class SubnetCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subnet
        fields = ['cidr', 'vlan', 'description', 'site', 'gateway', 'dns_servers']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class IPAddressCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IPAddress
        fields = ['address', 'subnet', 'hostname', 'mac_address', 'status', 'description']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)