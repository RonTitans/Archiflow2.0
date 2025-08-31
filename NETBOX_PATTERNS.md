# NetBox Design Patterns for ArchiFlow

## Key Takeaways from NetBox Architecture

### 1. Database Models Structure

#### Sites Model (Enhanced)
```python
# NetBox patterns to incorporate:
- Hierarchical structure (Region -> SiteGroup -> Site -> Location)
- Status choices (active, planned, staging, decommissioned, retired)
- Slug fields for URL-friendly names
- Natural sorting on name fields (db_collation="natural_sort")
- Time zones per site
- Physical address and shipping address separate
- Latitude/Longitude for mapping
- Facility field for external designations
- ASN (Autonomous System Number) relationships
- Tenant support for multi-tenancy
```

#### Device/Equipment Model (Enhanced)
```python
# NetBox patterns:
- DeviceType -> Device separation (template pattern)
- Manufacturer -> DeviceType -> Device hierarchy
- Position in rack (decimal for half-U devices)
- Face selection (front/rear)
- Serial number AND asset tag (separate)
- Platform (OS/firmware platform)
- DeviceRole (function of device)
- Virtual chassis support
- Primary IPv4/IPv6 fields
- Config context support (YAML/JSON configs)
- Component templates that auto-generate:
  - Console ports
  - Power ports
  - Interfaces
  - Device bays
```

#### IPAM Structure (Critical)
```python
# NetBox's proven IPAM hierarchy:
1. RIR (Regional Internet Registry)
2. Aggregate (large IP blocks)
3. Prefix (subnets with VRF support)
4. IPAddress (individual IPs)
5. IPRange (ranges of IPs)

# Key fields:
- IPNetworkField and IPAddressField (PostgreSQL inet/cidr types)
- VRF support for overlapping IP space
- Status tracking (active, reserved, deprecated, DHCP)
- Role assignment (loopback, secondary, anycast, VIP, VRRP, HSRP, GLBP, CARP)
- DNS name per IP
- NAT inside/outside relationships
- Generic assignment to any object (Interface, Service, etc.)
```

### 2. PostgreSQL Specific Features

```python
# NetBox uses advanced PostgreSQL features:
- CIDR/INET types for IP addresses
- MACADDR type for MAC addresses
- GiST indexes for IP containment queries
- Natural sorting collation
- JSONB for flexible data
- Full-text search
- Recursive CTEs for hierarchical data
```

### 3. Interface Model (Connects Everything)
```python
# NetBox Interface patterns:
- Type choices (100BASE-TX, 1000BASE-T, 10GBASE-SR, etc.)
- Virtual interface support (VLAN, LAG)
- Parent/child relationships (sub-interfaces)
- Bridge interfaces
- LAG membership
- PoE support (mode and type)
- Wireless attributes (channel, frequency, SSID)
- MTU, speed, duplex settings
- Management-only flag
- MAC address (separate model, many-to-many)
- Tagged/untagged VLANs
- IP address assignments (multiple per interface)
```

### 4. Component Architecture
```python
# Template Pattern for Components:
1. ComponentTemplate (on DeviceType)
2. Component (on Device, created from template)

# Benefits:
- Consistency across same device types
- Bulk creation when adding device
- Template updates don't affect existing devices
- Override/customize per device
```

### 5. Advanced Features

#### Hierarchical Data (MPTT)
```python
# NetBox uses django-mptt for:
- Regions (geographic hierarchy)
- Site Groups (organizational hierarchy)
- Locations (within sites)
- Rack Groups
- Tenant Groups

# Benefits:
- Efficient tree queries
- Breadcrumb navigation
- Inheritance of properties
```

#### Multi-Tenancy
```python
# Every major object has optional tenant:
- Sites
- Devices
- Prefixes
- IP Addresses
- VLANs
- Circuits

# Tenant groups for hierarchy
```

#### Change Tracking
```python
# NetBox tracks:
- Created/Updated timestamps
- Created/Updated by user
- Change log with diffs
- Object versioning
```

### 6. UI/UX Patterns

#### Interactive Tables
```python
# django-tables2 features:
- Clickable rows (navigate to detail)
- Column sorting
- Column visibility toggle
- Bulk selection
- Export (CSV, Export)
- Configurable columns per user
```

#### Status Badges
```python
# Consistent color coding:
- Green: Active/Operational
- Blue: Planned/Staged
- Yellow: Reserved/Maintenance
- Red: Offline/Failed
- Gray: Decommissioned/Deprecated
```

#### Forms
```python
# Smart forms with:
- Dynamic field dependencies
- Bulk edit capabilities
- Quick-add for related objects
- API-driven select fields
- Custom validation per object type
```

## Implementation Priority for ArchiFlow

### Phase 1: Core Models Update
1. **Update Sites Model**
   - Add Region and SiteGroup models
   - Add slug fields
   - Add physical_address, latitude, longitude
   - Add status choices

2. **Update Equipment Model**
   - Create Manufacturer model
   - Split into EquipmentType and Equipment
   - Add position, face, asset_tag
   - Add DeviceRole model

3. **Update IPAM Models**
   - Add RIR and Aggregate models
   - Use PostgreSQL inet/cidr fields
   - Add VRF model for overlapping IPs
   - Add IPRange model
   - Implement proper IP hierarchy

### Phase 2: Enhanced Features
1. **Interface Model**
   - Create comprehensive Interface model
   - Support virtual interfaces
   - MAC address management
   - VLAN assignments

2. **Component Templates**
   - Create template models
   - Auto-generation on device creation
   - Bulk component management

3. **Multi-Tenancy**
   - Add Tenant model
   - Add tenant field to all major models
   - Implement tenant filtering

### Phase 3: Advanced Features
1. **Change Tracking**
   - Implement audit log
   - User tracking on changes
   - Diff display

2. **Hierarchical Data**
   - Implement MPTT for trees
   - Breadcrumb navigation
   - Inheritance patterns

3. **Configuration Context**
   - YAML/JSON config storage
   - Template rendering
   - Variable substitution

## Database Migration Strategy

```sql
-- Key PostgreSQL extensions needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- Example of proper IPAM table
CREATE TABLE ipam_prefix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prefix CIDR NOT NULL,
    vrf_id UUID REFERENCES ipam_vrf(id),
    tenant_id UUID REFERENCES tenancy_tenant(id),
    status VARCHAR(50) NOT NULL,
    role_id UUID REFERENCES ipam_role(id),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by_id UUID REFERENCES auth_user(id),
    updated_by_id UUID REFERENCES auth_user(id)
);

-- GiST index for IP containment queries
CREATE INDEX idx_prefix_gist ON ipam_prefix USING GIST (prefix inet_ops);

-- Compound index for VRF + prefix lookups
CREATE INDEX idx_prefix_vrf ON ipam_prefix(vrf_id, prefix);
```

## API Design Patterns

```python
# NetBox API patterns:
1. Nested serializers with depth control
2. WritableNestedSerializer for updates
3. Brief mode for list views
4. Custom fields support
5. Bulk operations endpoints
6. GraphQL alongside REST
```

## Frontend Patterns

```javascript
// NetBox UI patterns to implement:
1. ObjectSelector component (searchable dropdown)
2. DynamicFilterForm (build filters from model)
3. BulkEditForm (edit multiple objects)
4. QuickAddForm (inline creation)
5. LiveSearch (API-powered search)
6. ChangeLogModal (view object history)
```

## Configuration

```python
# NetBox-style settings:
PAGINATE_COUNT = 50
PREFER_IPV6 = False
ENFORCE_GLOBAL_UNIQUE = True
RELEASE_CHECK_URL = None
MAINTENANCE_MODE = False
GRAPHQL_ENABLED = True
METRICS_ENABLED = True
```

This architecture has been refined over years by the NetBox community and represents industry best practices for network management systems.