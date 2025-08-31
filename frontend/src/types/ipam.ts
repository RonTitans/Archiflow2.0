export interface Subnet {
  id: string
  cidr: string
  vlan?: number
  description?: string
  site: string
  site_name?: string
  gateway?: string
  dns_servers?: string[]
  ip_count?: number
  used_count?: number
  ip_addresses?: IPAddress[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface IPAddress {
  id: string
  address: string
  subnet: string
  subnet_name?: string
  hostname?: string
  mac_address?: string
  status: 'available' | 'allocated' | 'reserved' | 'deprecated'
  status_display?: string
  description?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}