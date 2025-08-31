"""
Enhanced IPAM models based on NetBox architecture
This will replace the current models.py after testing
"""
import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField, CIIDRField
from django.contrib.postgres.indexes import GistIndex
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User
from apps.sites.models import Site


class RIR(models.Model):
    """Regional Internet Registry - Top level of IP hierarchy"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    is_private = models.BooleanField(
        default=False,
        help_text="IP space managed by this RIR is considered private (RFC1918, etc)"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        verbose_name = "RIR"
        verbose_name_plural = "RIRs"
        ordering = ['name']

    def __str__(self):
        return self.name


class VRF(models.Model):
    """Virtual Routing and Forwarding - Allows overlapping IP space"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    rd = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
        verbose_name="Route Distinguisher",
        help_text="Unique route distinguisher in format ASN:ID"
    )
    description = models.TextField(blank=True)
    enforce_unique = models.BooleanField(
        default=True,
        help_text="Enforce unique IP space within this VRF"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        verbose_name = "VRF"
        verbose_name_plural = "VRFs"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.rd})" if self.rd else self.name


class Role(models.Model):
    """Role for Prefixes and VLANs (Customer, Infrastructure, Management, etc)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    weight = models.PositiveIntegerField(default=1000)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['weight', 'name']

    def __str__(self):
        return self.name


class Aggregate(models.Model):
    """Large IP blocks at the top of the hierarchy"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prefix = CIIDRField()  # PostgreSQL CIDR field
    rir = models.ForeignKey(RIR, on_delete=models.PROTECT, related_name='aggregates')
    date_added = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        ordering = ['prefix', 'pk']
        indexes = [
            GistIndex(fields=['prefix'], opclasses=['inet_ops']),
        ]

    def __str__(self):
        return str(self.prefix)

    def clean(self):
        if self.prefix and self.prefix.prefixlen == 0:
            raise ValidationError("Cannot create aggregate with /0 mask.")


class Prefix(models.Model):
    """IP Prefix/Subnet with VRF support"""
    
    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', 'Active'
        RESERVED = 'reserved', 'Reserved'
        DEPRECATED = 'deprecated', 'Deprecated'
        CONTAINER = 'container', 'Container'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prefix = CIIDRField()
    vrf = models.ForeignKey(
        VRF, 
        on_delete=models.PROTECT, 
        related_name='prefixes',
        blank=True,
        null=True,
        help_text="VRF (Virtual Routing & Forwarding)"
    )
    site = models.ForeignKey(
        Site,
        on_delete=models.PROTECT,
        related_name='prefixes',
        blank=True,
        null=True
    )
    vlan = models.ForeignKey(
        'VLAN',
        on_delete=models.PROTECT,
        related_name='prefixes',
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        related_name='prefixes',
        blank=True,
        null=True
    )
    is_pool = models.BooleanField(
        default=False,
        help_text="This prefix is a pool for automatic IP assignment"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        verbose_name = "prefix"
        verbose_name_plural = "prefixes"
        ordering = ['vrf', 'prefix']
        indexes = [
            GistIndex(fields=['prefix'], opclasses=['inet_ops']),
            models.Index(fields=['vrf', 'prefix']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['vrf', 'prefix'],
                name='unique_vrf_prefix',
                condition=models.Q(vrf__isnull=False)
            ),
            models.UniqueConstraint(
                fields=['prefix'],
                name='unique_global_prefix',
                condition=models.Q(vrf__isnull=True)
            ),
        ]

    def __str__(self):
        return f"{self.prefix} ({self.vrf})" if self.vrf else str(self.prefix)

    @property
    def family(self):
        """Return IP version (4 or 6)"""
        return self.prefix.version if self.prefix else None
    
    @property
    def size(self):
        """Return the number of IP addresses in this prefix"""
        return self.prefix.num_addresses if self.prefix else 0


class IPAddress(models.Model):
    """Individual IP address with enhanced features"""
    
    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', 'Active'
        RESERVED = 'reserved', 'Reserved'
        DEPRECATED = 'deprecated', 'Deprecated'
        DHCP = 'dhcp', 'DHCP'
        SLAAC = 'slaac', 'SLAAC'
    
    class RoleChoices(models.TextChoices):
        LOOPBACK = 'loopback', 'Loopback'
        SECONDARY = 'secondary', 'Secondary'
        ANYCAST = 'anycast', 'Anycast'
        VIP = 'vip', 'VIP'
        VRRP = 'vrrp', 'VRRP'
        HSRP = 'hsrp', 'HSRP'
        GLBP = 'glbp', 'GLBP'
        CARP = 'carp', 'CARP'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address = CIIDRField(help_text="IPv4 or IPv6 address with mask")
    vrf = models.ForeignKey(
        VRF,
        on_delete=models.PROTECT,
        related_name='ip_addresses',
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE
    )
    role = models.CharField(
        max_length=50,
        choices=RoleChoices.choices,
        blank=True
    )
    dns_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Hostname or FQDN"
    )
    description = models.TextField(blank=True)
    nat_inside = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='nat_outside',
        blank=True,
        null=True,
        help_text="Inside IP address for NAT"
    )
    # Generic assignment to any object (Interface, Service, etc)
    assigned_object_type = models.ForeignKey(
        'contenttypes.ContentType',
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )
    assigned_object_id = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        verbose_name = "IP address"
        verbose_name_plural = "IP addresses"
        ordering = ['address']
        indexes = [
            GistIndex(fields=['address'], opclasses=['inet_ops']),
            models.Index(fields=['vrf', 'address']),
            models.Index(fields=['assigned_object_type', 'assigned_object_id']),
        ]

    def __str__(self):
        return str(self.address)

    @property
    def family(self):
        """Return IP version (4 or 6)"""
        return self.address.version if self.address else None


class IPRange(models.Model):
    """Range of IP addresses"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_address = CIIDRField()
    end_address = CIIDRField()
    vrf = models.ForeignKey(
        VRF,
        on_delete=models.PROTECT,
        related_name='ip_ranges',
        blank=True,
        null=True
    )
    site = models.ForeignKey(
        Site,
        on_delete=models.PROTECT,
        related_name='ip_ranges',
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=50,
        choices=IPAddress.StatusChoices.choices,
        default=IPAddress.StatusChoices.ACTIVE
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        related_name='ip_ranges',
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        ordering = ['vrf', 'start_address']
        indexes = [
            GistIndex(fields=['start_address'], opclasses=['inet_ops']),
            GistIndex(fields=['end_address'], opclasses=['inet_ops']),
        ]

    def __str__(self):
        return f"{self.start_address} - {self.end_address}"

    def clean(self):
        if self.start_address and self.end_address:
            if self.start_address.version != self.end_address.version:
                raise ValidationError("Start and end addresses must be the same IP version")
            if self.start_address > self.end_address:
                raise ValidationError("Start address must be less than or equal to end address")

    @property
    def size(self):
        """Return the number of IP addresses in this range"""
        if self.start_address and self.end_address:
            start = int(self.start_address.ip)
            end = int(self.end_address.ip)
            return end - start + 1
        return 0


class VLAN(models.Model):
    """VLAN model with site/group scoping"""
    
    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', 'Active'
        RESERVED = 'reserved', 'Reserved'
        DEPRECATED = 'deprecated', 'Deprecated'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey(
        Site,
        on_delete=models.PROTECT,
        related_name='vlans',
        blank=True,
        null=True,
        help_text="Site (optional)"
    )
    vid = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(4094)],
        verbose_name="VLAN ID"
    )
    name = models.CharField(max_length=100)
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        related_name='vlans',
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        verbose_name = "VLAN"
        verbose_name_plural = "VLANs"
        ordering = ['site', 'vid']
        constraints = [
            models.UniqueConstraint(
                fields=['site', 'vid'],
                name='unique_site_vid',
                condition=models.Q(site__isnull=False)
            ),
        ]

    def __str__(self):
        return f"{self.vid} ({self.name})"