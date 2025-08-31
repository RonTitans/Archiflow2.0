from rest_framework import serializers
from .models import Alert


class AlertSerializer(serializers.ModelSerializer):
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    equipment_name = serializers.CharField(source='equipment.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Alert
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AlertUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['status', 'notes']