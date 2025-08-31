import uuid
from django.db import models
from django.conf import settings

class DNSZone(models.Model):
    ZONE_TYPES = [
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=20, choices=ZONE_TYPES, default='primary')
    dnssec_enabled = models.BooleanField(default=False)
    serial = models.BigIntegerField(default=1)
    refresh = models.IntegerField(default=3600)
    retry = models.IntegerField(default=1800)
    expire = models.IntegerField(default=604800)
    minimum = models.IntegerField(default=86400)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dns_zones'
        ordering = ['name']

    def __str__(self):
        return self.name

class DNSRecord(models.Model):
    RECORD_TYPES = [
        ('A', 'A'),
        ('AAAA', 'AAAA'),
        ('CNAME', 'CNAME'),
        ('MX', 'MX'),
        ('TXT', 'TXT'),
        ('NS', 'NS'),
        ('SOA', 'SOA'),
        ('PTR', 'PTR'),
        ('SRV', 'SRV'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    zone = models.ForeignKey(DNSZone, on_delete=models.CASCADE, related_name='records')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=RECORD_TYPES)
    value = models.TextField()
    ttl = models.IntegerField(default=3600)
    priority = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dns_records'
        ordering = ['zone', 'name', 'type']
        unique_together = [['zone', 'name', 'type', 'value']]

    def __str__(self):
        return f"{self.name}.{self.zone.name} ({self.type})"