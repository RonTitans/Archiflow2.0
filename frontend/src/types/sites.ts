export interface Site {
  id: string
  name: string
  code: string
  status: 'active' | 'planned' | 'staging' | 'decommissioning' | 'retired'
  status_display?: string
  
  // Location fields
  address?: string
  city?: string
  state_province?: string
  postal_code?: string
  country?: string
  region?: 'americas' | 'emea' | 'apac' | 'asia_pacific'
  region_display?: string
  latitude?: number
  longitude?: number
  time_zone?: string
  
  // Organization fields
  group?: 'branch' | 'hq' | 'dc' | 'corporate' | 'remote'
  group_display?: string
  tenant?: string
  tenant_name?: string
  facility_id?: string
  asn?: number
  
  // Relationships
  primary_contact?: string
  primary_contact_name?: string
  
  // Additional fields
  description?: string
  comments?: string
  physical_address?: string
  shipping_address?: string
  
  // Statistics
  equipment_count?: number
  subnet_count?: number
  alert_count?: number
  
  // Audit fields
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  created_by_username?: string
  updated_by_username?: string
}

export interface SiteStats {
  total: number
  by_status: Record<string, number>
  by_region: Record<string, number>
  by_group: Record<string, number>
}

export interface SiteFormData {
  name: string
  code: string
  status: string
  description?: string
  address?: string
  city?: string
  state_province?: string
  postal_code?: string
  country?: string
  region?: string
  latitude?: number
  longitude?: number
  time_zone?: string
  group?: string
  tenant?: string
  facility_id?: string
  asn?: number
  primary_contact?: string
  physical_address?: string
  shipping_address?: string
  comments?: string
}