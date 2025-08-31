import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { DNSZone, DNSRecord } from '@/types/dns'

export const useDNSZones = () => {
  return useQuery<DNSZone[]>({
    queryKey: ['dns-zones'],
    queryFn: async () => {
      const response = await api.get('/dns/zones/')
      return response.data.results || response.data
    },
  })
}

export const useDNSZoneDetail = (id: string) => {
  return useQuery<DNSZone>({
    queryKey: ['dns-zones', id],
    queryFn: async () => {
      const response = await api.get(`/dns/zones/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useDNSRecords = (zoneId?: string) => {
  return useQuery<DNSRecord[]>({
    queryKey: ['dns-records', zoneId],
    queryFn: async () => {
      const url = zoneId ? `/dns/records/?zone=${zoneId}` : '/dns/records/'
      const response = await api.get(url)
      return response.data.results || response.data
    },
  })
}

export const useCreateDNSZone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<DNSZone>) => {
      const response = await api.post('/dns/zones/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dns-zones'] })
    },
  })
}

export const useCreateDNSRecord = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<DNSRecord>) => {
      const response = await api.post('/dns/records/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dns-records'] })
    },
  })
}