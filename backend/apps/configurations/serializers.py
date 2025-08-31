from rest_framework import serializers
from .models import ConfigTemplate, RenderedConfig


class RenderedConfigSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    
    class Meta:
        model = RenderedConfig
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class ConfigTemplateListSerializer(serializers.ModelSerializer):
    backup_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = ConfigTemplate
        fields = ['id', 'name', 'device_type', 'description', 'backup_count', 'created_at']


class ConfigTemplateDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class ConfigTemplateCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigTemplate
        fields = ['name', 'device_type', 'template_content', 'variables_schema', 'description']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class RenderedConfigCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RenderedConfig
        fields = ['template', 'equipment', 'site', 'variables', 'rendered_content']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)