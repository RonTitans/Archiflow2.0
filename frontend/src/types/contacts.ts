export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  role?: string
  group?: string
  group_name?: string
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface ContactGroup {
  id: string
  name: string
  description?: string
  contact_count?: number
  contacts?: Contact[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}