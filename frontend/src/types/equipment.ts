export interface Equipment {
  id: string
  name: string
  device_type: string
  manufacturer: string
  model: string
  serial_number?: string
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned'
  status_display?: string
  site: string
  site_name?: string
  rack_location?: string
  rack_position?: number
  description?: string
  interface_count?: number
  interfaces?: Interface[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface Interface {
  id: string
  equipment: string
  name: string
  type: string
  speed?: string
  mac_address?: string
  ip_address?: string
  vlan?: number
  status: 'up' | 'down' | 'admin_down'
  description?: string
  created_at: string
  updated_at: string
}