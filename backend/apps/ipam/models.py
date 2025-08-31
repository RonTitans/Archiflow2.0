import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
from netaddr import IPNetwork, IPAddress

class Subnet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cidr = models.CharField(max_length=43, unique=True)  # Max CIDR length is 43 chars
    vlan_id = models.IntegerField(null=True, blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, related_name='subnets')
    gateway = models.GenericIPAddressField(null=True, blank=True)
    dns_servers = ArrayField(
        models.GenericIPAddressField(),
        blank=True,
        default=list
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subnets_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subnets_updated'
    )

    class Meta:
        db_table = 'subnets'
        ordering = ['cidr']
        indexes = [
            models.Index(fields=['cidr']),
        ]

    def __str__(self):
        return f"{self.cidr} - {self.purpose}" if self.purpose else str(self.cidr)

    @property
    def network(self):
        return IPNetwork(str(self.cidr))

    @property
    def total_ips(self):
        return self.network.size

    @property
    def assigned_ips(self):
        return self.ip_addresses.filter(status='ASSIGNED').count()

    @property
    def usage_percentage(self):
        if self.total_ips == 0:
            return 0
        return round((self.assigned_ips / self.total_ips) * 100, 2)

class IPAddress(models.Model):
    STATUS_CHOICES = [
        ('FREE', 'Free'),
        ('ASSIGNED', 'Assigned'),
        ('RESERVED', 'Reserved'),
        ('CONFLICT', 'Conflict'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address = models.GenericIPAddressField(unique=True)
    subnet = models.ForeignKey(Subnet, on_delete=models.CASCADE, related_name='ip_addresses')
    hostname = models.CharField(max_length=255, blank=True)
    mac_address = models.CharField(max_length=17, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='FREE')
    equipment = models.ForeignKey(
        'equipment.Equipment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ip_allocations'
    )
    interface = models.ForeignKey(
        'equipment.Interface',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ip_addresses'
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ips_assigned'
    )

    class Meta:
        db_table = 'ip_addresses'
        ordering = ['address']
        indexes = [
            models.Index(fields=['address']),
            models.Index(fields=['mac_address']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.address} ({self.status})"

    def allocate(self, equipment=None, interface=None, hostname=None, mac_address=None):
        self.status = 'ASSIGNED'
        self.equipment = equipment
        self.interface = interface
        if hostname:
            self.hostname = hostname
        if mac_address:
            self.mac_address = mac_address
        self.save()

    def release(self):
        self.status = 'FREE'
        self.equipment = None
        self.interface = None
        self.hostname = ''
        self.mac_address = ''
        self.save()

    def mark_conflict(self):
        self.status = 'CONFLICT'
        self.save()