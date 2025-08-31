from rest_framework import serializers
from .models import DNSZone, DNSRecord


class DNSRecordSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = DNSRecord
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class DNSZoneListSerializer(serializers.ModelSerializer):
    record_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = DNSZone
        fields = ['id', 'name', 'type', 'description', 'record_count', 'created_at']


class DNSZoneDetailSerializer(serializers.ModelSerializer):
    records = DNSRecordSerializer(many=True, read_only=True)
    
    class Meta:
        model = DNSZone
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class DNSZoneCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DNSZone
        fields = ['name', 'type', 'description', 'ttl']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class DNSRecordCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DNSRecord
        fields = ['zone', 'name', 'type', 'value', 'ttl', 'priority']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)