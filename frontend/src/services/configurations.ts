import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { ConfigTemplate, ConfigBackup } from '@/types/configurations'

export const useConfigTemplates = () => {
  return useQuery<ConfigTemplate[]>({
    queryKey: ['config-templates'],
    queryFn: async () => {
      const response = await api.get('/configurations/templates/')
      return response.data.results || response.data
    },
  })
}

export const useConfigTemplateDetail = (id: string) => {
  return useQuery<ConfigTemplate>({
    queryKey: ['config-templates', id],
    queryFn: async () => {
      const response = await api.get(`/configurations/templates/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useConfigBackups = (equipmentId?: string) => {
  return useQuery<ConfigBackup[]>({
    queryKey: ['config-backups', equipmentId],
    queryFn: async () => {
      const url = equipmentId ? `/configurations/backups/?equipment=${equipmentId}` : '/configurations/backups/'
      const response = await api.get(url)
      return response.data.results || response.data
    },
  })
}

export const useCreateConfigTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ConfigTemplate>) => {
      const response = await api.post('/configurations/templates/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-templates'] })
    },
  })
}

export const useCreateConfigBackup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ConfigBackup>) => {
      const response = await api.post('/configurations/backups/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-backups'] })
    },
  })
}