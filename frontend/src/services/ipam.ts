import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Subnet, IPAddress } from '@/types/ipam'

export const useSubnets = () => {
  return useQuery<Subnet[]>({
    queryKey: ['subnets'],
    queryFn: async () => {
      const response = await api.get('/ipam/subnets/')
      return response.data.results || response.data
    },
  })
}

export const useSubnetDetail = (id: string) => {
  return useQuery<Subnet>({
    queryKey: ['subnets', id],
    queryFn: async () => {
      const response = await api.get(`/ipam/subnets/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useIPAddresses = (subnetId?: string) => {
  return useQuery<IPAddress[]>({
    queryKey: ['ip-addresses', subnetId],
    queryFn: async () => {
      const url = subnetId ? `/ipam/ip-addresses/?subnet=${subnetId}` : '/ipam/ip-addresses/'
      const response = await api.get(url)
      return response.data.results || response.data
    },
  })
}

export const useCreateSubnet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Subnet>) => {
      const response = await api.post('/ipam/subnets/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subnets'] })
    },
  })
}

export const useUpdateSubnet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Subnet> & { id: string }) => {
      const response = await api.patch(`/ipam/subnets/${id}/`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subnets'] })
    },
  })
}

export const useAllocateIP = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subnetId: string) => {
      const response = await api.post(`/ipam/subnets/${subnetId}/allocate/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ip-addresses'] })
    },
  })
}