import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Alert, AlertRule } from '@/types/alerts'

export const useAlerts = () => {
  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await api.get('/alerts/alerts/')
      return response.data.results || response.data
    },
  })
}

export const useAlertDetail = (id: string) => {
  return useQuery<Alert>({
    queryKey: ['alerts', id],
    queryFn: async () => {
      const response = await api.get(`/alerts/alerts/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useAlertRules = () => {
  return useQuery<AlertRule[]>({
    queryKey: ['alert-rules'],
    queryFn: async () => {
      const response = await api.get('/alerts/rules/')
      return response.data.results || response.data
    },
  })
}

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/alerts/alerts/${id}/acknowledge/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}

export const useResolveAlert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/alerts/alerts/${id}/resolve/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}

export const useCreateAlertRule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<AlertRule>) => {
      const response = await api.post('/alerts/rules/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] })
    },
  })
}