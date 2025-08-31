"""
Enhanced Equipment models based on NetBox architecture
Implements the Template pattern for consistent device components
"""
import uuid
from decimal import Decimal
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User
from apps.sites.models import Site


class Manufacturer(models.Model):
    """Hardware manufacturer (Cisco, Juniper, Dell, etc)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Platform(models.Model):
    """Operating system/firmware platform (IOS, JunOS, etc)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    manufacturer = models.ForeignKey(
        Manufacturer,
        on_delete=models.SET_NULL,
        related_name='platforms',
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class DeviceRole(models.Model):
    """Functional role of device (router, switch, firewall, server, etc)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    color = models.CharField(max_length=6, default='cccccc', help_text="Hex color code")
    vm_role = models.BooleanField(
        default=False,
        help_text="This role is applicable to virtual machines"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class DeviceType(models.Model):
    """Template for a specific model of device"""
    
    class SubdeviceRole(models.TextChoices):
        PARENT = 'parent', 'Parent'
        CHILD = 'child', 'Child'
    
    class Airflow(models.TextChoices):
        FRONT_TO_REAR = 'front-to-rear', 'Front to rear'
        REAR_TO_FRONT = 'rear-to-front', 'Rear to front'
        LEFT_TO_RIGHT = 'left-to-right', 'Left to right'
        RIGHT_TO_LEFT = 'right-to-left', 'Right to left'
        SIDE_TO_REAR = 'side-to-rear', 'Side to rear'
        PASSIVE = 'passive', 'Passive'
        MIXED = 'mixed', 'Mixed'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    manufacturer = models.ForeignKey(
        Manufacturer,
        on_delete=models.PROTECT,
        related_name='device_types'
    )
    model = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    part_number = models.CharField(max_length=50, blank=True)
    u_height = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=Decimal('1.0'),
        validators=[MinValueValidator(Decimal('0.5'))],
        help_text="Height in rack units"
    )
    is_full_depth = models.BooleanField(
        default=True,
        help_text="Device consumes both front and rear rack faces"
    )
    subdevice_role = models.CharField(
        max_length=50,
        choices=SubdeviceRole.choices,
        blank=True,
        help_text="Parent devices house child devices in device bays"
    )
    airflow = models.CharField(
        max_length=50,
        choices=Airflow.choices,
        blank=True
    )
    weight = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Weight in kilograms"
    )
    weight_unit = models.CharField(
        max_length=10,
        default='kg',
        choices=[('kg', 'Kilograms'), ('lb', 'Pounds')]
    )
    front_image = models.ImageField(upload_to='device-types/', blank=True)
    rear_image = models.ImageField(upload_to='device-types/', blank=True)
    description = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        ordering = ['manufacturer', 'model']
        constraints = [
            models.UniqueConstraint(
                fields=['manufacturer', 'model'],
                name='unique_manufacturer_model'
            ),
            models.UniqueConstraint(
                fields=['manufacturer', 'slug'],
                name='unique_manufacturer_slug'
            ),
        ]

    def __str__(self):
        return f"{self.manufacturer.name} {self.model}"


class Device(models.Model):
    """Physical hardware device instance"""
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PLANNED = 'planned', 'Planned'
        STAGED = 'staged', 'Staged'
        FAILED = 'failed', 'Failed'
        INVENTORY = 'inventory', 'Inventory'
        DECOMMISSIONING = 'decommissioning', 'Decommissioning'
        OFFLINE = 'offline', 'Offline'
    
    class Face(models.TextChoices):
        FRONT = 'front', 'Front'
        REAR = 'rear', 'Rear'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=64,
        blank=True,
        null=True,
        db_collation="C",  # Natural sort
        help_text="Device hostname"
    )
    device_type = models.ForeignKey(
        DeviceType,
        on_delete=models.PROTECT,
        related_name='devices'
    )
    role = models.ForeignKey(
        DeviceRole,
        on_delete=models.PROTECT,
        related_name='devices',
        help_text="Functional role"
    )
    platform = models.ForeignKey(
        Platform,
        on_delete=models.SET_NULL,
        related_name='devices',
        blank=True,
        null=True
    )
    serial = models.CharField(
        max_length=50,
        blank=True,
        db_index=True,
        help_text="Serial number"
    )
    asset_tag = models.CharField(
        max_length=50,
        blank=True,
        unique=True,
        null=True,
        help_text="Asset tag"
    )
    site = models.ForeignKey(
        Site,
        on_delete=models.PROTECT,
        related_name='devices'
    )
    rack = models.ForeignKey(
        'Rack',
        on_delete=models.PROTECT,
        related_name='devices',
        blank=True,
        null=True
    )
    position = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True,
        validators=[MinValueValidator(Decimal('0.5')), MaxValueValidator(Decimal('100'))],
        help_text="Position in rack (U)"
    )
    face = models.CharField(
        max_length=50,
        choices=Face.choices,
        blank=True,
        help_text="Rack face"
    )
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.STAGED
    )
    primary_ip4 = models.ForeignKey(
        'ipam.IPAddress',
        on_delete=models.SET_NULL,
        related_name='+',
        blank=True,
        null=True,
        verbose_name="Primary IPv4"
    )
    primary_ip6 = models.ForeignKey(
        'ipam.IPAddress',
        on_delete=models.SET_NULL,
        related_name='+',
        blank=True,
        null=True,
        verbose_name="Primary IPv6"
    )
    cluster = models.ForeignKey(
        'Cluster',
        on_delete=models.SET_NULL,
        related_name='devices',
        blank=True,
        null=True
    )
    virtual_chassis = models.ForeignKey(
        'VirtualChassis',
        on_delete=models.SET_NULL,
        related_name='devices',
        blank=True,
        null=True
    )
    vc_position = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        validators=[MaxValueValidator(255)]
    )
    vc_priority = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        validators=[MaxValueValidator(255)]
    )
    description = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    config_context = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['rack', 'position', 'face'],
                name='unique_rack_position_face',
                condition=models.Q(rack__isnull=False, position__isnull=False, face__isnull=False)
            ),
            models.UniqueConstraint(
                fields=['virtual_chassis', 'vc_position'],
                name='unique_vc_position',
                condition=models.Q(virtual_chassis__isnull=False, vc_position__isnull=False)
            ),
        ]

    def __str__(self):
        return self.name or f"{self.device_type.manufacturer.name} {self.device_type.model} ({self.pk})"

    def clean(self):
        super().clean()
        
        # Validate rack position
        if self.position is not None:
            if self.rack is None:
                raise ValidationError("Position cannot be set without a rack")
            if self.face == '':
                raise ValidationError("Face must be set when position is set")
        
        # Validate virtual chassis position
        if self.vc_position is not None and self.virtual_chassis is None:
            raise ValidationError("VC position cannot be set without a virtual chassis")

    def save(self, *args, **kwargs):
        # Create components from device type templates on first save
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new and self.device_type:
            self._create_components_from_templates()
    
    def _create_components_from_templates(self):
        """Create device components from device type templates"""
        # This would create interfaces, power ports, etc from templates
        # Implementation depends on component models
        pass


class Rack(models.Model):
    """Physical equipment rack"""
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PLANNED = 'planned', 'Planned'
        RESERVED = 'reserved', 'Reserved'
        DEPRECATED = 'deprecated', 'Deprecated'
    
    class Type(models.TextChoices):
        WALL_FRAME = 'wall-frame', '2-post frame'
        WALL_CABINET = 'wall-cabinet', 'Wall-mounted cabinet'
        FLOOR_FRAME = '4-post-frame', '4-post frame'
        FLOOR_CABINET = '4-post-cabinet', '4-post cabinet'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    site = models.ForeignKey(Site, on_delete=models.PROTECT, related_name='racks')
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    type = models.CharField(
        max_length=50,
        choices=Type.choices,
        blank=True
    )
    serial = models.CharField(max_length=50, blank=True)
    asset_tag = models.CharField(
        max_length=50,
        blank=True,
        unique=True,
        null=True
    )
    u_height = models.PositiveSmallIntegerField(
        default=42,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Height in rack units"
    )
    desc_units = models.BooleanField(
        default=False,
        help_text="Number units from top to bottom"
    )
    outer_width = models.PositiveSmallIntegerField(blank=True, null=True)
    outer_depth = models.PositiveSmallIntegerField(blank=True, null=True)
    outer_unit = models.CharField(
        max_length=10,
        default='mm',
        choices=[('mm', 'Millimeters'), ('in', 'Inches')]
    )
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        ordering = ['site', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['site', 'name'],
                name='unique_site_rack_name'
            ),
        ]

    def __str__(self):
        return f"{self.site.name} - {self.name}"


class VirtualChassis(models.Model):
    """Virtual chassis for stacked switches"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=64, unique=True)
    domain = models.CharField(max_length=30, blank=True)
    master = models.OneToOneField(
        Device,
        on_delete=models.SET_NULL,
        related_name='+',
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "virtual chassis"
        verbose_name_plural = "virtual chassis"

    def __str__(self):
        return self.name


class Cluster(models.Model):
    """Cluster of devices (virtualization, compute, etc)"""
    
    class Type(models.TextChoices):
        VMWARE = 'vmware', 'VMware'
        HYPER_V = 'hyper-v', 'Hyper-V'
        KVM = 'kvm', 'KVM'
        PROXMOX = 'proxmox', 'Proxmox'
        KUBERNETES = 'kubernetes', 'Kubernetes'
        OPENSTACK = 'openstack', 'OpenStack'
        OTHER = 'other', 'Other'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=50, choices=Type.choices)
    site = models.ForeignKey(
        Site,
        on_delete=models.PROTECT,
        related_name='clusters',
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name