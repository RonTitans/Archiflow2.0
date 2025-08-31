import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Site, SiteFormData, SiteStats } from '@/types/sites'

// API functions
export const fetchSites = async (filters?: any) => {
  const params = new URLSearchParams(filters)
  const response = await api.get(`/sites/sites/?${params}`)
  return response.data
}

export const fetchSite = async (id: string) => {
  const response = await api.get(`/sites/sites/${id}/`)
  return response.data
}

export const createSite = async (data: SiteFormData) => {
  const response = await api.post('/sites/sites/', data)
  return response.data
}

export const updateSite = async (id: string, data: SiteFormData) => {
  const response = await api.patch(`/sites/sites/${id}/`, data)
  return response.data
}

export const deleteSite = async (id: string) => {
  await api.delete(`/sites/sites/${id}/`)
}

export const bulkDeleteSites = async (ids: string[]) => {
  const response = await api.post('/sites/sites/bulk_delete/', { ids })
  return response.data
}

export const bulkUpdateSites = async (ids: string[], updates: Partial<Site>) => {
  const response = await api.post('/sites/sites/bulk_update/', { ids, updates })
  return response.data
}

export const exportSites = async (filters?: any) => {
  const params = new URLSearchParams(filters)
  const response = await api.get(`/sites/sites/export/?${params}`, {
    responseType: 'blob'
  })
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `sites_${new Date().toISOString()}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export const fetchSiteStats = async () => {
  const response = await api.get('/sites/sites/stats/')
  return response.data
}

export const fetchSiteDetailStats = async (id: string) => {
  const response = await api.get(`/sites/sites/${id}/site_stats/`)
  return response.data
}

// React Query hooks
export const useSites = (filters?: any) => {
  return useQuery<{ results: Site[], count: number }>({
    queryKey: ['sites', filters],
    queryFn: () => fetchSites(filters),
  })
}

export const useSite = (id: string) => {
  return useQuery<Site>({
    queryKey: ['sites', id],
    queryFn: () => fetchSite(id),
    enabled: !!id
  })
}

export const useSiteStats = () => {
  return useQuery<SiteStats>({
    queryKey: ['sites', 'stats'],
    queryFn: fetchSiteStats
  })
}

export const useSiteDetailStats = (id: string) => {
  return useQuery({
    queryKey: ['sites', id, 'stats'],
    queryFn: () => fetchSiteDetailStats(id),
    enabled: !!id
  })
}

export const useCreateSite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    }
  })
}

export const useUpdateSite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: SiteFormData }) => updateSite(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      queryClient.invalidateQueries({ queryKey: ['sites', variables.id] })
    }
  })
}

export const useDeleteSite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    }
  })
}