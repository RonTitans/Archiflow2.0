import uuid
from django.db import models
from django.conf import settings

class Rack(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, related_name='racks')
    height = models.IntegerField(default=42, help_text='Height in rack units (U)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'racks'
        ordering = ['site', 'name']
        unique_together = [['site', 'name']]

    def __str__(self):
        return f"{self.site.code} - {self.name}"

class Equipment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
        ('retired', 'Retired'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=255, blank=True)
    model = models.CharField(max_length=255, blank=True)
    serial_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, related_name='equipment')
    rack = models.ForeignKey(Rack, on_delete=models.SET_NULL, null=True, blank=True)
    rack_position = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipment_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipment_updated'
    )

    class Meta:
        db_table = 'equipment'
        ordering = ['site', 'name']

    def __str__(self):
        return f"{self.name} ({self.site.code})"

    @property
    def ip_addresses(self):
        return self.ip_allocations.all()

class Interface(models.Model):
    INTERFACE_TYPES = [
        ('ethernet', 'Ethernet'),
        ('fiber', 'Fiber'),
        ('serial', 'Serial'),
        ('virtual', 'Virtual'),
        ('wifi', 'WiFi'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='interfaces')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=INTERFACE_TYPES, default='ethernet')
    speed = models.IntegerField(null=True, blank=True, help_text='Speed in Mbps')
    mac_address = models.CharField(max_length=17, null=True, blank=True)
    enabled = models.BooleanField(default=True)
    connected_to = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='connected_from'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'interfaces'
        ordering = ['equipment', 'name']
        unique_together = [['equipment', 'name']]

    def __str__(self):
        return f"{self.equipment.name} - {self.name}"