import uuid
from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('ALLOCATE', 'Allocate'),
        ('RELEASE', 'Release'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    table_name = models.CharField(max_length=100)
    record_id = models.UUIDField()
    old_values = models.JSONField(default=dict)
    new_values = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_log'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['table_name']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.action} on {self.table_name} by {self.user}"