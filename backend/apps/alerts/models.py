import uuid
from django.db import models
from django.conf import settings

class Alert(models.Model):
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('warning', 'Warning'),
        ('info', 'Info'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('acknowledged', 'Acknowledged'),
        ('closed', 'Closed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='info')
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True)
    source = models.CharField(max_length=100, blank=True)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, null=True, blank=True, related_name='alerts')
    equipment = models.ForeignKey('equipment.Equipment', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    acknowledged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='acknowledged_alerts'
    )
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    closed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='closed_alerts'
    )
    closed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'alerts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.severity.upper()}: {self.title}"


class AlertRule(models.Model):
    TRIGGER_CHOICES = [
        ('threshold', 'Threshold'),
        ('status', 'Status Change'),
        ('pattern', 'Pattern Match'),
        ('availability', 'Availability'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    trigger_type = models.CharField(max_length=20, choices=TRIGGER_CHOICES)
    condition = models.JSONField(help_text='JSON condition for triggering alert')
    severity = models.CharField(max_length=20, choices=Alert.SEVERITY_CHOICES, default='info')
    enabled = models.BooleanField(default=True)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, null=True, blank=True, related_name='alert_rules')
    equipment_type = models.CharField(max_length=100, blank=True, help_text='Equipment type to apply rule to')
    notification_channels = models.JSONField(default=list, help_text='List of notification channels')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alert_rules_created'
    )

    class Meta:
        db_table = 'alert_rules'
        ordering = ['name']

    def __str__(self):
        return self.name