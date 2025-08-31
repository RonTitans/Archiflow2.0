import uuid
from django.db import models
from django.conf import settings


class TenantGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenant_groups'
        ordering = ['name']

    def __str__(self):
        return self.name


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    group = models.ForeignKey(
        TenantGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tenants'
    )
    description = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tenants_created'
    )

    class Meta:
        db_table = 'tenants'
        ordering = ['name']

    def __str__(self):
        return self.name