export interface DNSZone {
  id: string
  name: string
  type: 'forward' | 'reverse'
  description?: string
  ttl?: number
  record_count?: number
  records?: DNSRecord[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface DNSRecord {
  id: string
  zone: string
  zone_name?: string
  name: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'PTR' | 'SRV'
  type_display?: string
  value: string
  ttl?: number
  priority?: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}