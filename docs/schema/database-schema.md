# ArchiFlow Database Schema

## Core Tables

### Sites
```sql
sites
- id (UUID, PK)
- name (VARCHAR(255), NOT NULL)
- code (VARCHAR(50), UNIQUE, NOT NULL)
- address (TEXT)
- status (ENUM: active, inactive, planned)
- primary_contact_id (FK -> contacts.id)
- latitude (DECIMAL)
- longitude (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- created_by_id (FK -> users.id)
- updated_by_id (FK -> users.id)
```

### Equipment
```sql
equipment
- id (UUID, PK)
- name (VARCHAR(255), NOT NULL)
- type (VARCHAR(100))
- manufacturer (VARCHAR(255))
- model (VARCHAR(255))
- serial_number (VARCHAR(255), UNIQUE)
- status (ENUM: active, inactive, maintenance, retired)
- site_id (FK -> sites.id)
- rack_id (FK -> racks.id, NULLABLE)
- rack_position (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### IP Addresses
```sql
ip_addresses
- id (UUID, PK)
- address (INET, UNIQUE, NOT NULL)
- subnet_id (FK -> subnets.id)
- hostname (VARCHAR(255))
- mac_address (MACADDR)
- status (ENUM: FREE, ASSIGNED, RESERVED, CONFLICT)
- equipment_id (FK -> equipment.id, NULLABLE)
- interface_id (FK -> interfaces.id, NULLABLE)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- INDEX ON address
- INDEX ON mac_address
- INDEX ON status
```

### Subnets
```sql
subnets
- id (UUID, PK)
- cidr (CIDR, UNIQUE, NOT NULL)
- vlan_id (INTEGER)
- purpose (VARCHAR(255))
- site_id (FK -> sites.id)
- gateway (INET)
- dns_servers (INET[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- INDEX ON cidr USING GIST
```

### DNS Zones
```sql
dns_zones
- id (UUID, PK)
- name (VARCHAR(255), UNIQUE, NOT NULL)
- type (ENUM: primary, secondary)
- dnssec_enabled (BOOLEAN DEFAULT FALSE)
- serial (BIGINT)
- refresh (INTEGER)
- retry (INTEGER)
- expire (INTEGER)
- minimum (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### DNS Records
```sql
dns_records
- id (UUID, PK)
- zone_id (FK -> dns_zones.id)
- name (VARCHAR(255), NOT NULL)
- type (ENUM: A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, SRV)
- value (TEXT, NOT NULL)
- ttl (INTEGER DEFAULT 3600)
- priority (INTEGER) -- for MX/SRV records
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(zone_id, name, type, value)
```

### Configuration Templates
```sql
config_templates
- id (UUID, PK)
- name (VARCHAR(255), NOT NULL)
- description (TEXT)
- template_content (TEXT, NOT NULL)
- variables_schema (JSONB)
- device_type (VARCHAR(100))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- version (INTEGER DEFAULT 1)
```

### Rendered Configurations
```sql
rendered_configs
- id (UUID, PK)
- template_id (FK -> config_templates.id)
- equipment_id (FK -> equipment.id, NULLABLE)
- site_id (FK -> sites.id, NULLABLE)
- variables (JSONB)
- rendered_content (TEXT)
- validation_status (ENUM: pending, valid, invalid)
- validation_errors (JSONB)
- created_at (TIMESTAMP)
- created_by_id (FK -> users.id)
```

### Diagrams
```sql
diagrams
- id (UUID, PK)
- name (VARCHAR(255), NOT NULL)
- site_id (FK -> sites.id, NULLABLE)
- type (ENUM: network, rack, logical, physical)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Diagram Versions
```sql
diagram_versions
- id (UUID, PK)
- diagram_id (FK -> diagrams.id)
- version_number (INTEGER, NOT NULL)
- content (JSONB) -- draw.io JSON format
- svg_export (TEXT)
- created_at (TIMESTAMP)
- created_by_id (FK -> users.id)
- UNIQUE(diagram_id, version_number)
```

### Alerts
```sql
alerts
- id (UUID, PK)
- severity (ENUM: critical, warning, info)
- title (VARCHAR(255), NOT NULL)
- message (TEXT)
- source (VARCHAR(100))
- site_id (FK -> sites.id, NULLABLE)
- equipment_id (FK -> equipment.id, NULLABLE)
- status (ENUM: active, acknowledged, closed)
- acknowledged_by_id (FK -> users.id, NULLABLE)
- acknowledged_at (TIMESTAMP)
- closed_by_id (FK -> users.id, NULLABLE)
- closed_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

### Contacts
```sql
contacts
- id (UUID, PK)
- site_id (FK -> sites.id)
- name (VARCHAR(255), NOT NULL)
- role (VARCHAR(100))
- phone (VARCHAR(50))
- email (VARCHAR(255))
- is_primary (BOOLEAN DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Users
```sql
users
- id (UUID, PK)
- username (VARCHAR(100), UNIQUE, NOT NULL)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password_hash (VARCHAR(255), NOT NULL)
- first_name (VARCHAR(100))
- last_name (VARCHAR(100))
- role_id (FK -> roles.id)
- language (VARCHAR(10) DEFAULT 'en')
- theme (ENUM: light, dark, auto DEFAULT 'auto')
- is_active (BOOLEAN DEFAULT TRUE)
- last_login (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Audit Log
```sql
audit_log
- id (UUID, PK)
- user_id (FK -> users.id)
- action (VARCHAR(50)) -- CREATE, UPDATE, DELETE, ALLOCATE, RELEASE
- table_name (VARCHAR(100))
- record_id (UUID)
- old_values (JSONB)
- new_values (JSONB)
- ip_address (INET)
- user_agent (TEXT)
- created_at (TIMESTAMP)
- INDEX ON user_id
- INDEX ON table_name
- INDEX ON created_at
```