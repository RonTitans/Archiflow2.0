import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Tenant {
  id: string
  name: string
  slug: string
  group?: string
  description?: string
  created_at: string
  updated_at: string
}

export const fetchTenants = async () => {
  const response = await api.get('/tenants/tenants/')
  return response.data
}

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants
  })
}