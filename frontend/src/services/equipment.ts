import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Equipment } from '@/types/equipment'

export const useEquipment = () => {
  return useQuery<Equipment[]>({
    queryKey: ['equipment'],
    queryFn: async () => {
      const response = await api.get('/equipment/equipment/')
      return response.data.results || response.data
    },
  })
}

export const useEquipmentDetail = (id: string) => {
  return useQuery<Equipment>({
    queryKey: ['equipment', id],
    queryFn: async () => {
      const response = await api.get(`/equipment/equipment/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateEquipment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Equipment>) => {
      const response = await api.post('/equipment/equipment/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })
}

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Equipment> & { id: string }) => {
      const response = await api.patch(`/equipment/equipment/${id}/`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })
}

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/equipment/equipment/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })
}