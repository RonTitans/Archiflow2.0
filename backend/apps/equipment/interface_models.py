"""
Interface models - the bridge between devices and networks
Based on NetBox's comprehensive interface system
"""
import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User


class InterfaceTemplate(models.Model):
    """Template for interfaces on a DeviceType"""
    
    class Type(models.TextChoices):
        # Physical interface types
        ETHERNET_100BASE_TX = '100base-tx', '100BASE-TX (10/100ME)'
        ETHERNET_1000BASE_T = '1000base-t', '1000BASE-T (1GE)'
        ETHERNET_2_5GBASE_T = '2.5gbase-t', '2.5GBASE-T (2.5GE)'
        ETHERNET_5GBASE_T = '5gbase-t', '5GBASE-T (5GE)'
        ETHERNET_10GBASE_T = '10gbase-t', '10GBASE-T (10GE)'
        ETHERNET_10GBASE_SR = '10gbase-x-sr', '10GBASE-SR (10GE)'
        ETHERNET_10GBASE_LR = '10gbase-x-lr', '10GBASE-LR (10GE)'
        ETHERNET_25GBASE = '25gbase-x', '25GBASE (25GE)'
        ETHERNET_40GBASE = '40gbase-x', '40GBASE (40GE)'
        ETHERNET_100GBASE = '100gbase-x', '100GBASE (100GE)'
        # Wireless
        WIFI_80211A = 'ieee802.11a', 'IEEE 802.11a'
        WIFI_80211B = 'ieee802.11b', 'IEEE 802.11b'
        WIFI_80211G = 'ieee802.11g', 'IEEE 802.11g'
        WIFI_80211N = 'ieee802.11n', 'IEEE 802.11n'
        WIFI_80211AC = 'ieee802.11ac', 'IEEE 802.11ac'
        WIFI_80211AX = 'ieee802.11ax', 'IEEE 802.11ax'
        # Virtual interface types
        LAG = 'lag', 'Link Aggregation Group (LAG)'
        VIRTUAL = 'virtual', 'Virtual'
        BRIDGE = 'bridge', 'Bridge'
        LOOPBACK = 'loopback', 'Loopback'
        TUNNEL = 'tunnel', 'Tunnel'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    device_type = models.ForeignKey(
        'DeviceType',
        on_delete=models.CASCADE,
        related_name='interface_templates'
    )
    name = models.CharField(max_length=64)
    label = models.CharField(max_length=64, blank=True)
    type = models.CharField(max_length=50, choices=Type.choices)
    mgmt_only = models.BooleanField(
        default=False,
        help_text="This is a management interface"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['device_type', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['device_type', 'name'],
                name='unique_devicetype_interface_name'
            ),
        ]

    def __str__(self):
        return f"{self.device_type} - {self.name}"


class Interface(models.Model):
    """Network interface on a device"""
    
    class Type(models.TextChoices):
        # Physical interface types
        ETHERNET_100BASE_TX = '100base-tx', '100BASE-TX (10/100ME)'
        ETHERNET_1000BASE_T = '1000base-t', '1000BASE-T (1GE)'
        ETHERNET_2_5GBASE_T = '2.5gbase-t', '2.5GBASE-T (2.5GE)'
        ETHERNET_5GBASE_T = '5gbase-t', '5GBASE-T (5GE)'
        ETHERNET_10GBASE_T = '10gbase-t', '10GBASE-T (10GE)'
        ETHERNET_10GBASE_SR = '10gbase-x-sr', '10GBASE-SR (10GE)'
        ETHERNET_10GBASE_LR = '10gbase-x-lr', '10GBASE-LR (10GE)'
        ETHERNET_25GBASE = '25gbase-x', '25GBASE (25GE)'
        ETHERNET_40GBASE = '40gbase-x', '40GBASE (40GE)'
        ETHERNET_100GBASE = '100gbase-x', '100GBASE (100GE)'
        # Wireless
        WIFI_80211A = 'ieee802.11a', 'IEEE 802.11a'
        WIFI_80211B = 'ieee802.11b', 'IEEE 802.11b'
        WIFI_80211G = 'ieee802.11g', 'IEEE 802.11g'
        WIFI_80211N = 'ieee802.11n', 'IEEE 802.11n'
        WIFI_80211AC = 'ieee802.11ac', 'IEEE 802.11ac'
        WIFI_80211AX = 'ieee802.11ax', 'IEEE 802.11ax'
        # Virtual interface types
        LAG = 'lag', 'Link Aggregation Group (LAG)'
        VIRTUAL = 'virtual', 'Virtual'
        BRIDGE = 'bridge', 'Bridge'
        LOOPBACK = 'loopback', 'Loopback'
        TUNNEL = 'tunnel', 'Tunnel'
    
    class Mode(models.TextChoices):
        ACCESS = 'access', 'Access'
        TAGGED = 'tagged', 'Tagged'
        TAGGED_ALL = 'tagged-all', 'Tagged (All)'
    
    class Duplex(models.TextChoices):
        HALF = 'half', 'Half'
        FULL = 'full', 'Full'
        AUTO = 'auto', 'Auto'
    
    class PoEMode(models.TextChoices):
        PD = 'pd', 'PD (Powered Device)'
        PSE = 'pse', 'PSE (Power Sourcing Equipment)'
    
    class PoEType(models.TextChoices):
        TYPE1_8023AF = 'type1-ieee802.3af', 'Type 1 (IEEE 802.3af)'
        TYPE2_8023AT = 'type2-ieee802.3at', 'Type 2 (IEEE 802.3at)'
        TYPE3_8023BT = 'type3-ieee802.3bt', 'Type 3 (IEEE 802.3bt)'
        TYPE4_8023BT = 'type4-ieee802.3bt', 'Type 4 (IEEE 802.3bt)'
        PASSIVE_24V = 'passive-24v', 'Passive 24V'
        PASSIVE_48V = 'passive-48v', 'Passive 48V'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    device = models.ForeignKey(
        'Device',
        on_delete=models.CASCADE,
        related_name='interfaces'
    )
    name = models.CharField(max_length=64)
    label = models.CharField(max_length=64, blank=True)
    type = models.CharField(max_length=50, choices=Type.choices)
    enabled = models.BooleanField(default=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='child_interfaces',
        blank=True,
        null=True,
        help_text="Parent interface (for subinterfaces)"
    )
    bridge = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='bridged_interfaces',
        blank=True,
        null=True,
        help_text="Bridge interface"
    )
    lag = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='member_interfaces',
        blank=True,
        null=True,
        help_text="LAG parent interface"
    )
    mtu = models.PositiveIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1), MaxValueValidator(65536)]
    )
    mac_address = models.CharField(
        max_length=17,
        blank=True,
        help_text="MAC address (format: AA:BB:CC:DD:EE:FF)"
    )
    speed = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Speed in Mbps"
    )
    duplex = models.CharField(
        max_length=50,
        choices=Duplex.choices,
        blank=True
    )
    wwn = models.CharField(
        max_length=23,
        blank=True,
        help_text="World Wide Name (for FC interfaces)"
    )
    mgmt_only = models.BooleanField(
        default=False,
        help_text="Management interface only"
    )
    # VLAN configuration
    mode = models.CharField(
        max_length=50,
        choices=Mode.choices,
        blank=True,
        help_text="Interface mode for VLANs"
    )
    untagged_vlan = models.ForeignKey(
        'ipam.VLAN',
        on_delete=models.SET_NULL,
        related_name='interfaces_untagged',
        blank=True,
        null=True
    )
    tagged_vlans = models.ManyToManyField(
        'ipam.VLAN',
        related_name='interfaces_tagged',
        blank=True
    )
    # PoE configuration
    poe_mode = models.CharField(
        max_length=50,
        choices=PoEMode.choices,
        blank=True
    )
    poe_type = models.CharField(
        max_length=50,
        choices=PoEType.choices,
        blank=True
    )
    # Wireless configuration
    rf_role = models.CharField(
        max_length=20,
        blank=True,
        choices=[('ap', 'Access Point'), ('station', 'Station')]
    )
    rf_channel = models.CharField(max_length=20, blank=True)
    rf_channel_frequency = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Frequency in MHz"
    )
    rf_channel_width = models.DecimalField(
        max_digits=7,
        decimal_places=3,
        blank=True,
        null=True,
        help_text="Width in MHz"
    )
    wireless_lans = models.ManyToManyField(
        'WirelessLAN',
        related_name='interfaces',
        blank=True
    )
    # Connection tracking
    cable = models.ForeignKey(
        'Cable',
        on_delete=models.SET_NULL,
        related_name='+',
        blank=True,
        null=True
    )
    mark_connected = models.BooleanField(
        default=False,
        help_text="Mark as connected (no cable)"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')

    class Meta:
        ordering = ['device', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['device', 'name'],
                name='unique_device_interface_name'
            ),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.name}"
    
    @property
    def is_virtual(self):
        """Check if this is a virtual interface type"""
        return self.type in [
            self.Type.VIRTUAL,
            self.Type.LAG,
            self.Type.BRIDGE,
            self.Type.LOOPBACK,
            self.Type.TUNNEL,
        ]
    
    @property
    def is_wireless(self):
        """Check if this is a wireless interface"""
        return self.type in [
            self.Type.WIFI_80211A,
            self.Type.WIFI_80211B,
            self.Type.WIFI_80211G,
            self.Type.WIFI_80211N,
            self.Type.WIFI_80211AC,
            self.Type.WIFI_80211AX,
        ]
    
    @property
    def is_connected(self):
        """Check if interface is connected"""
        return self.cable is not None or self.mark_connected
    
    @property
    def ip_addresses(self):
        """Get all IP addresses assigned to this interface"""
        from apps.ipam.models import IPAddress
        return IPAddress.objects.filter(
            assigned_object_type__model='interface',
            assigned_object_id=self.id
        )
    
    def clean(self):
        super().clean()
        
        # Virtual interfaces cannot have a cable
        if self.is_virtual and self.cable:
            raise ValidationError("Virtual interfaces cannot have a cable attached")
        
        # Virtual interfaces cannot be marked as connected
        if self.is_virtual and self.mark_connected:
            raise ValidationError("Virtual interfaces cannot be marked as connected")
        
        # Parent interface must belong to the same device
        if self.parent and self.parent.device != self.device:
            raise ValidationError("Parent interface must belong to the same device")
        
        # LAG interface must belong to the same device
        if self.lag and self.lag.device != self.device:
            raise ValidationError("LAG interface must belong to the same device")
        
        # Bridge interface must belong to the same device
        if self.bridge and self.bridge.device != self.device:
            raise ValidationError("Bridge interface must belong to the same device")
        
        # PoE type requires PoE mode
        if self.poe_type and not self.poe_mode:
            raise ValidationError("PoE type requires PoE mode to be set")
        
        # Wireless settings only for wireless interfaces
        if not self.is_wireless:
            if self.rf_role:
                raise ValidationError("RF role can only be set on wireless interfaces")
            if self.rf_channel:
                raise ValidationError("RF channel can only be set on wireless interfaces")


class Cable(models.Model):
    """Physical cable connecting interfaces"""
    
    class Type(models.TextChoices):
        CAT3 = 'cat3', 'CAT3'
        CAT5 = 'cat5', 'CAT5'
        CAT5E = 'cat5e', 'CAT5e'
        CAT6 = 'cat6', 'CAT6'
        CAT6A = 'cat6a', 'CAT6a'
        CAT7 = 'cat7', 'CAT7'
        CAT7A = 'cat7a', 'CAT7a'
        CAT8 = 'cat8', 'CAT8'
        FIBER_LC = 'fiber-lc', 'Fiber (LC)'
        FIBER_SC = 'fiber-sc', 'Fiber (SC)'
        FIBER_ST = 'fiber-st', 'Fiber (ST)'
        FIBER_MPO = 'fiber-mpo', 'Fiber (MPO)'
        DAC_ACTIVE = 'dac-active', 'DAC (Active)'
        DAC_PASSIVE = 'dac-passive', 'DAC (Passive)'
        POWER = 'power', 'Power'
    
    class Status(models.TextChoices):
        CONNECTED = 'connected', 'Connected'
        PLANNED = 'planned', 'Planned'
        DECOMMISSIONED = 'decommissioned', 'Decommissioned'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    a_side_type = models.ForeignKey(
        'contenttypes.ContentType',
        on_delete=models.PROTECT,
        related_name='+'
    )
    a_side_id = models.UUIDField()
    b_side_type = models.ForeignKey(
        'contenttypes.ContentType',
        on_delete=models.PROTECT,
        related_name='+'
    )
    b_side_id = models.UUIDField()
    type = models.CharField(max_length=50, choices=Type.choices, blank=True)
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.CONNECTED
    )
    label = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=6, blank=True, help_text="Hex color code")
    length = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True
    )
    length_unit = models.CharField(
        max_length=10,
        default='m',
        choices=[('m', 'Meters'), ('ft', 'Feet')]
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.label or f"Cable {self.pk}"


class WirelessLAN(models.Model):
    """Wireless network configuration"""
    
    class AuthType(models.TextChoices):
        OPEN = 'open', 'Open'
        WEP = 'wep', 'WEP'
        WPA = 'wpa', 'WPA Personal'
        WPA_ENTERPRISE = 'wpa-enterprise', 'WPA Enterprise'
    
    class AuthCipher(models.TextChoices):
        AUTO = 'auto', 'Auto'
        TKIP = 'tkip', 'TKIP'
        AES = 'aes', 'AES'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ssid = models.CharField(max_length=32)
    vlan = models.ForeignKey(
        'ipam.VLAN',
        on_delete=models.SET_NULL,
        related_name='wireless_lans',
        blank=True,
        null=True
    )
    auth_type = models.CharField(max_length=50, choices=AuthType.choices, blank=True)
    auth_cipher = models.CharField(max_length=50, choices=AuthCipher.choices, blank=True)
    auth_psk = models.CharField(
        max_length=64,
        blank=True,
        help_text="Pre-shared key"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "wireless LAN"
        ordering = ['ssid']

    def __str__(self):
        return self.ssid