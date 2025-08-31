import uuid
from django.db import models
from django.conf import settings

class ConfigTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    template_content = models.TextField()
    variables_schema = models.JSONField(default=dict)
    device_type = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    version = models.IntegerField(default=1)

    class Meta:
        db_table = 'config_templates'
        ordering = ['name']

    def __str__(self):
        return self.name

class RenderedConfig(models.Model):
    VALIDATION_STATUS = [
        ('pending', 'Pending'),
        ('valid', 'Valid'),
        ('invalid', 'Invalid'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template = models.ForeignKey(ConfigTemplate, on_delete=models.CASCADE, related_name='rendered_configs')
    equipment = models.ForeignKey('equipment.Equipment', on_delete=models.CASCADE, null=True, blank=True)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, null=True, blank=True)
    variables = models.JSONField(default=dict)
    rendered_content = models.TextField()
    validation_status = models.CharField(max_length=20, choices=VALIDATION_STATUS, default='pending')
    validation_errors = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'rendered_configs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.template.name} - {self.created_at}"