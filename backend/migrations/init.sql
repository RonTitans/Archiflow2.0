-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE site_status AS ENUM ('active', 'inactive', 'planned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE equipment_status AS ENUM ('active', 'inactive', 'maintenance', 'retired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ip_status AS ENUM ('FREE', 'ASSIGNED', 'RESERVED', 'CONFLICT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'info');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;