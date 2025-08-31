import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Contact, ContactGroup } from '@/types/contacts'

export const useContacts = () => {
  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await api.get('/contacts/contacts/')
      return response.data.results || response.data
    },
  })
}

export const useContactDetail = (id: string) => {
  return useQuery<Contact>({
    queryKey: ['contacts', id],
    queryFn: async () => {
      const response = await api.get(`/contacts/contacts/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useContactGroups = () => {
  return useQuery<ContactGroup[]>({
    queryKey: ['contact-groups'],
    queryFn: async () => {
      const response = await api.get('/contacts/groups/')
      return response.data.results || response.data
    },
  })
}

export const useCreateContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Contact>) => {
      const response = await api.post('/contacts/contacts/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Contact> & { id: string }) => {
      const response = await api.patch(`/contacts/contacts/${id}/`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contacts/contacts/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}