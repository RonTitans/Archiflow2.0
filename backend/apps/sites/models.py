import uuid
from django.db import models
from django.conf import settings

class Site(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('planned', 'Planned'),
        ('staging', 'Staging'),
        ('decommissioning', 'Decommissioning'),
        ('retired', 'Retired'),
    ]
    
    REGION_CHOICES = [
        ('americas', 'Americas'),
        ('emea', 'EMEA'),
        ('apac', 'APAC'),
        ('asia_pacific', 'Asia Pacific'),
    ]
    
    GROUP_CHOICES = [
        ('branch', 'Branch'),
        ('hq', 'HQ'),
        ('dc', 'Data Center'),
        ('corporate', 'Corporate'),
        ('remote', 'Remote'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, db_index=True)
    code = models.CharField(max_length=50, unique=True, help_text='Unique site identifier (e.g., NYC-01)')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned', db_index=True)
    
    # Location fields
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True, db_index=True)
    state_province = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=20, choices=REGION_CHOICES, blank=True, db_index=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    time_zone = models.CharField(max_length=50, default='UTC', blank=True)
    
    # Organization fields
    group = models.CharField(max_length=20, choices=GROUP_CHOICES, blank=True, db_index=True)
    tenant = models.ForeignKey(
        'tenants.Tenant',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='sites'
    )
    facility_id = models.CharField(max_length=50, blank=True, help_text='External facility reference')
    asn = models.PositiveIntegerField(null=True, blank=True, help_text='Autonomous System Number')
    
    # Contact
    primary_contact = models.ForeignKey(
        'contacts.Contact', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='primary_for_sites'
    )
    
    # Additional fields
    description = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    physical_address = models.TextField(blank=True, help_text='Physical location details')
    shipping_address = models.TextField(blank=True, help_text='Shipping address if different')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sites_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sites_updated'
    )

    class Meta:
        db_table = 'sites'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def equipment_count(self):
        return self.equipment.count()

    @property
    def subnet_count(self):
        return self.subnets.count()

    @property
    def alert_count(self):
        return self.alerts.filter(status='active').count()