from rest_framework import serializers
from .models import Equipment, Interface
from apps.sites.models import Site


class InterfaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interface
        fields = '__all__'


class EquipmentListSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    interface_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'device_type', 'manufacturer', 'model', 
                 'serial_number', 'status', 'status_display', 'site', 
                 'site_name', 'interface_count', 'created_at']


class EquipmentDetailSerializer(serializers.ModelSerializer):
    interfaces = InterfaceSerializer(many=True, read_only=True)
    site_name = serializers.CharField(source='site.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Equipment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class EquipmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['name', 'device_type', 'manufacturer', 'model', 'serial_number',
                 'status', 'site', 'rack_location', 'rack_position', 'description']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)