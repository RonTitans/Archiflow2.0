export interface Alert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  severity_display?: string
  status: 'new' | 'acknowledged' | 'resolved'
  status_display?: string
  message: string
  source?: string
  equipment?: string
  equipment_name?: string
  rule?: string
  acknowledged_by?: string
  acknowledged_at?: string
  resolved_by?: string
  resolved_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface AlertRule {
  id: string
  name: string
  metric: string
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  description?: string
  enabled: boolean
  alert_count?: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}