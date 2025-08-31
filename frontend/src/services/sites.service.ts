import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface Site {
  id: string
  name: string
  code: string
  address: string
  status: 'active' | 'inactive' | 'planned' | 'maintenance'
  status_display?: string
  latitude?: number
  longitude?: number
  description?: string
  primary_contact?: Contact
  contacts?: Contact[]
  equipment_count?: number
  subnet_count?: number
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface Contact {
  id: string
  name: string
  role?: string
  email?: string
  phone?: string
  is_primary?: boolean
}

export interface SiteStats {
  total_sites: number
  active_sites: number
  total_equipment: number
  total_subnets: number
  total_ips: number
}

class SitesService {
  async getSites(params?: {
    search?: string
    status?: string
    page?: number
    page_size?: number
  }): Promise<{ results: Site[]; count: number }> {
    const response = await axios.get(`${API_URL}/sites/`, { params })
    return response.data
  }

  async getSite(id: string): Promise<Site> {
    const response = await axios.get(`${API_URL}/sites/${id}/`)
    return response.data
  }

  async createSite(data: Partial<Site>): Promise<Site> {
    const response = await axios.post(`${API_URL}/sites/`, data)
    return response.data
  }

  async updateSite(id: string, data: Partial<Site>): Promise<Site> {
    const response = await axios.patch(`${API_URL}/sites/${id}/`, data)
    return response.data
  }

  async deleteSite(id: string): Promise<void> {
    await axios.delete(`${API_URL}/sites/${id}/`)
  }

  async getSiteStats(): Promise<SiteStats> {
    const response = await axios.get(`${API_URL}/sites/stats/`)
    return response.data
  }

  async exportSites(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await axios.get(`${API_URL}/sites/export/`, {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  }

  async importSites(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post(`${API_URL}/sites/import/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }
}

export default new SitesService()