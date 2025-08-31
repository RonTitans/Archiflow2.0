'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { FormProvider } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, MapPin, X } from 'lucide-react'
import { Site, SiteFormData } from '@/types/sites'
import { useCreateSite, useUpdateSite } from '@/services/sites'
import { useContacts } from '@/services/contacts'
import { useTenants } from '@/services/tenants'

const siteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(50),
  status: z.enum(['active', 'planned', 'staging', 'decommissioning', 'retired']),
  description: z.string().optional().default(''),
  
  // Location fields
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state_province: z.string().optional().default(''),
  postal_code: z.string().optional().default(''),
  country: z.string().optional().default(''),
  region: z.enum(['americas', 'emea', 'apac', 'asia_pacific', '']).optional().default(''),
  latitude: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
  longitude: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
  time_zone: z.string().optional().default('UTC'),
  
  // Organization fields
  group: z.enum(['branch', 'hq', 'dc', 'corporate', 'remote', '']).optional().default(''),
  tenant: z.string().optional().default(''),
  facility_id: z.string().optional().default(''),
  asn: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
  
  // Contact
  primary_contact: z.string().optional().default(''),
  
  // Additional
  physical_address: z.string().optional().default(''),
  shipping_address: z.string().optional().default(''),
  comments: z.string().optional().default(''),
})

interface SiteFormModalProps {
  open: boolean
  onClose: () => void
  site?: Site | null
  onSuccess: () => void
}

const SiteFormModal: React.FC<SiteFormModalProps> = ({
  open,
  onClose,
  site,
  onSuccess
}) => {
  const { toast } = useToast()
  const createMutation = useCreateSite()
  const updateMutation = useUpdateSite()
  const { data: contacts } = useContacts()
  const { data: tenants } = useTenants()
  
  const isEditing = !!site
  
  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: '',
      code: '',
      status: 'planned',
      description: '',
      address: '',
      city: '',
      state_province: '',
      postal_code: '',
      country: '',
      region: '',
      time_zone: 'UTC',
      group: '',
      tenant: '',
      facility_id: '',
      asn: null,
      primary_contact: '',
      physical_address: '',
      shipping_address: '',
      comments: '',
      latitude: null,
      longitude: null,
    }
  })

  useEffect(() => {
    if (site) {
      form.reset({
        name: site.name,
        code: site.code,
        status: site.status,
        description: site.description || '',
        address: site.address || '',
        city: site.city || '',
        state_province: site.state_province || '',
        postal_code: site.postal_code || '',
        country: site.country || '',
        region: site.region || '',
        latitude: site.latitude || null,
        longitude: site.longitude || null,
        time_zone: site.time_zone || 'UTC',
        group: site.group || '',
        tenant: site.tenant || '',
        facility_id: site.facility_id || '',
        asn: site.asn || null,
        primary_contact: site.primary_contact || '',
        physical_address: site.physical_address || '',
        shipping_address: site.shipping_address || '',
        comments: site.comments || '',
      })
    } else {
      form.reset({
        name: '',
        code: '',
        status: 'planned',
        description: '',
        address: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: '',
        region: '',
        time_zone: 'UTC',
        group: '',
        tenant: '',
        facility_id: '',
        asn: null,
        primary_contact: '',
        physical_address: '',
        shipping_address: '',
        comments: '',
        latitude: null,
        longitude: null,
      })
    }
  }, [site, form])

  const onSubmit = async (data: SiteFormData) => {
    try {
      // Clean up data - remove empty strings and convert to proper types
      const cleanedData: any = {
        name: data.name,
        code: data.code.toUpperCase(),
        status: data.status,
      }
      
      // Add optional fields only if they have values
      if (data.description) cleanedData.description = data.description
      if (data.address) cleanedData.address = data.address
      if (data.city) cleanedData.city = data.city
      if (data.state_province) cleanedData.state_province = data.state_province
      if (data.postal_code) cleanedData.postal_code = data.postal_code
      if (data.country) cleanedData.country = data.country
      if (data.region && data.region !== '') cleanedData.region = data.region
      if (data.time_zone) cleanedData.time_zone = data.time_zone
      if (data.group && data.group !== '') cleanedData.group = data.group
      if (data.tenant && data.tenant !== '') cleanedData.tenant = data.tenant
      if (data.facility_id) cleanedData.facility_id = data.facility_id
      if (data.primary_contact && data.primary_contact !== '') cleanedData.primary_contact = data.primary_contact
      if (data.physical_address) cleanedData.physical_address = data.physical_address
      if (data.shipping_address) cleanedData.shipping_address = data.shipping_address
      if (data.comments) cleanedData.comments = data.comments
      
      // Handle numeric fields
      if (data.latitude !== null && data.latitude !== undefined && data.latitude !== '') {
        cleanedData.latitude = typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude
      }
      if (data.longitude !== null && data.longitude !== undefined && data.longitude !== '') {
        cleanedData.longitude = typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude
      }
      if (data.asn !== null && data.asn !== undefined && data.asn !== '') {
        cleanedData.asn = typeof data.asn === 'string' ? parseInt(data.asn) : data.asn
      }
      
      if (isEditing) {
        await updateMutation.mutateAsync({ id: site.id, data: cleanedData })
        toast({
          title: 'Success',
          description: `Site ${data.name} updated successfully`
        })
      } else {
        await createMutation.mutateAsync(cleanedData)
        toast({
          title: 'Success',
          description: `Site ${data.name} created successfully`
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save site',
        variant: 'destructive'
      })
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1e293b',
                margin: 0 
              }}>
                {isEditing ? 'Edit Site' : 'Create New Site'}
              </h2>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#64748b',
                marginTop: '0.25rem' 
              }}>
                {isEditing ? 'Update site information and details' : 'Add a new site to your network infrastructure'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <X size={20} />
            </button>
          </div>
        
          {/* Modal Body */}
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: 'calc(85vh - 120px)' // Fixed height minus header and footer
            }}>
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '1.5rem',
                minHeight: '400px', // Minimum height to prevent collapse
                maxHeight: 'calc(85vh - 200px)' // Maximum height for scrolling
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '0.5rem'
                  }}>
                    {['basic', 'location', 'organization', 'additional'].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          // Tab switching logic would go here
                          document.querySelectorAll('[data-tab-content]').forEach(el => {
                            (el as HTMLElement).style.display = 'none'
                          })
                          const content = document.querySelector(`[data-tab-content="${tab}"]`) as HTMLElement
                          if (content) content.style.display = 'block'
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          borderBottom: '2px solid transparent',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#1e293b'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#64748b'
                        }}
                      >
                        {tab === 'basic' ? 'Basic Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                
                  {/* Basic Info Tab */}
                  <div data-tab-content="basic" style={{ display: 'block', minHeight: '350px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Name Field */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.375rem'
                        }}>
                          Name *
                        </label>
                        <input
                          type="text"
                          {...form.register('name')}
                          placeholder="New York Office"
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            fontSize: '0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#111827',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6'
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                        {form.formState.errors.name && (
                          <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                  
                      {/* Code Field */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.375rem'
                        }}>
                          Code *
                        </label>
                        <input
                          type="text"
                          {...form.register('code')}
                          placeholder="NYC-01"
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            fontSize: '0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#111827',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6'
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          Unique site identifier
                        </p>
                        {form.formState.errors.code && (
                          <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                            {form.formState.errors.code.message}
                          </p>
                        )}
                      </div>
                  
                      {/* Status Field */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.375rem'
                        }}>
                          Status *
                        </label>
                        <select
                          {...form.register('status')}
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            fontSize: '0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#111827',
                            outline: 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6'
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = 'none'
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="planned">Planned</option>
                          <option value="staging">Staging</option>
                          <option value="decommissioning">Decommissioning</option>
                          <option value="retired">Retired</option>
                        </select>
                        {form.formState.errors.status && (
                          <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                            {form.formState.errors.status.message}
                          </p>
                        )}
                      </div>
                  
                      {/* Description Field */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.375rem'
                        }}>
                          Description
                        </label>
                        <textarea
                          {...form.register('description')}
                          placeholder="Main office location for North American operations"
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            fontSize: '0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#111827',
                            outline: 'none',
                            transition: 'all 0.2s',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6'
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                        {form.formState.errors.description && (
                          <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                            {form.formState.errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Location Tab */}
                  <div data-tab-content="location" style={{ display: 'none', minHeight: '350px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Address Field */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.375rem'
                        }}>
                          Address
                        </label>
                        <textarea
                          {...form.register('address')}
                          placeholder="123 Main St, Suite 100"
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            fontSize: '0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#111827',
                            outline: 'none',
                            transition: 'all 0.2s',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6'
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                  
                      {/* City and State Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.375rem'
                          }}>
                            City
                          </label>
                          <input
                            type="text"
                            {...form.register('city')}
                            placeholder="New York"
                            style={{
                              width: '100%',
                              padding: '0.625rem 0.875rem',
                              fontSize: '0.875rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                              color: '#111827',
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6'
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.375rem'
                          }}>
                            State/Province
                          </label>
                          <input
                            type="text"
                            {...form.register('state_province')}
                            placeholder="NY"
                            style={{
                              width: '100%',
                              padding: '0.625rem 0.875rem',
                              fontSize: '0.875rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                              color: '#111827',
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6'
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                        </div>
                      </div>
                  
                      {/* Postal Code and Country Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.375rem'
                          }}>
                            Postal Code
                          </label>
                          <input
                            type="text"
                            {...form.register('postal_code')}
                            placeholder="10001"
                            style={{
                              width: '100%',
                              padding: '0.625rem 0.875rem',
                              fontSize: '0.875rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                              color: '#111827',
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6'
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.375rem'
                          }}>
                            Country
                          </label>
                          <input
                            type="text"
                            {...form.register('country')}
                            placeholder="USA"
                            style={{
                              width: '100%',
                              padding: '0.625rem 0.875rem',
                              fontSize: '0.875rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                              color: '#111827',
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6'
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Organization Tab - Placeholder */}
                  <div data-tab-content="organization" style={{ display: 'none', minHeight: '350px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '350px', justifyContent: 'center', alignItems: 'center' }}>
                      <p style={{ color: '#6b7280' }}>Organization fields coming soon...</p>
                    </div>
                  </div>
                  
                  {/* Additional Tab - Placeholder */}
                  <div data-tab-content="additional" style={{ display: 'none', minHeight: '350px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '350px', justifyContent: 'center', alignItems: 'center' }}>
                      <p style={{ color: '#6b7280' }}>Additional fields coming soon...</p>
                    </div>
                  </div>
                </div>
              </div>
              
              
              {/* Modal Footer */}
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#0284c7'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0ea5e9'
                  }}
                >
                  {isLoading && <Loader2 className="animate-spin" size={16} />}
                  {isEditing ? 'Update Site' : 'Create Site'}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  )
}

export default SiteFormModal