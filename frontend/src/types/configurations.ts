export interface ConfigTemplate {
  id: string
  name: string
  device_type: string
  template_content: string
  variables_schema?: any
  description?: string
  backup_count?: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface ConfigBackup {
  id: string
  equipment: string
  equipment_name?: string
  config_content: string
  version?: string
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}