'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Edit, Trash2, MapPin,
  Server, Network, AlertCircle, Users, Clock
} from 'lucide-react'
import { useSite, useSiteDetailStats, useDeleteSite } from '@/services/sites'
import { useToast } from '@/components/ui/use-toast'
import SiteFormModal from '@/components/modules/sites/SiteFormModal'
import { cn } from '@/lib/utils'

const statusColors = {
  active: 'bg-green-500 text-white',
  planned: 'bg-blue-500 text-white',
  staging: 'bg-orange-500 text-white',
  decommissioning: 'bg-yellow-500 text-white',
  retired: 'bg-gray-500 text-white'
} as const

export default function SiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const siteId = params.id as string
  
  const { data: site, isLoading, refetch } = useSite(siteId)
  const { data: stats } = useSiteDetailStats(siteId)
  const deleteMutation = useDeleteSite()
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${site?.name}? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(siteId)
        toast({
          title: 'Success',
          description: 'Site deleted successfully'
        })
        router.push('/sites')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete site',
          variant: 'destructive'
        })
      }
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AppLayout>
    )
  }

  if (!site) {
    return (
      <AppLayout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-100">Site not found</h2>
            <p className="text-gray-400 mt-2">The requested site could not be found.</p>
            <Button onClick={() => router.push('/sites')} className="mt-4">
              Back to Sites
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100%' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => router.push('/sites')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9'
              e.currentTarget.style.color = '#1e293b'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = '#64748b'
            }}
          >
            <ArrowLeft size={16} />
            Back to Sites
          </button>
        </div>

        {/* Page Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                  {site.name}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: site.status === 'active' ? '#10b981' : '#6b7280',
                  color: 'white'
                }}>
                  {site.status_display || site.status?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                <span>Site Code: <strong>{site.code}</strong></span>
                {site.region_display && <span>Region: <strong>{site.region_display}</strong></span>}
              </div>
              {site.description && (
                <p style={{ marginTop: '0.75rem', color: '#475569', fontSize: '0.875rem', maxWidth: '48rem' }}>
                  {site.description}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284c7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0ea5e9'
                }}
              >
                <Edit size={16} />
                Edit Site
              </button>
              <button
                onClick={handleDelete}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444'
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MapPin size={16} style={{ color: '#0ea5e9' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>LOCATION</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              {site.city || 'Not Set'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              {[site.state_province, site.country].filter(Boolean).join(', ') || 'No location data'}
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Server size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>EQUIPMENT</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              {stats?.equipment_count || 0}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Active devices</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Network size={16} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>IP ADDRESSES</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              {stats?.subnet_count || 0}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Allocated subnets</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} style={{ color: '#f97316' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>ACTIVE ALERTS</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: stats?.alert_count > 0 ? '#f97316' : '#1e293b', margin: 0 }}>
              {stats?.alert_count || 0}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Require attention</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.25rem'
        }}>
          {['overview', 'equipment', 'ipam', 'alerts', 'contacts', 'audit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === tab ? '#0ea5e9' : 'transparent',
                color: activeTab === tab ? 'white' : '#64748b',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {tab === 'ipam' ? 'IP & DNS' : tab === 'audit' ? 'Audit Log' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Site Information */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  Site Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>STATUS</p>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: site.status === 'active' ? '#10b981' : '#6b7280',
                      color: 'white'
                    }}>
                      {site.status_display || site.status?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>REGION</p>
                    <p style={{ color: '#1e293b' }}>{site.region_display || 'Not specified'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>GROUP</p>
                    <p style={{ color: '#1e293b' }}>{site.group_display || 'Not specified'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>TENANT</p>
                    <p style={{ color: '#1e293b' }}>{site.tenant_name || 'Not assigned'}</p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  Location Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>FULL ADDRESS</p>
                    <p style={{ color: '#1e293b' }}>{site.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>CITY</p>
                    <p style={{ color: '#1e293b' }}>{site.city || 'Not specified'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>STATE/PROVINCE</p>
                    <p style={{ color: '#1e293b' }}>{site.state_province || 'Not specified'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>COUNTRY</p>
                    <p style={{ color: '#1e293b' }}>{site.country || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <Server size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '1rem' }}>No equipment configured for this site yet</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Equipment assigned to this site will appear here</p>
            </div>
          )}

          {activeTab === 'ipam' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <Network size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '1rem' }}>No IP allocations for this site yet</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>IP addresses and subnets will be displayed here</p>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <AlertCircle size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '1rem' }}>No active alerts for this site</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Any system alerts will be shown here</p>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <Users size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '1rem' }}>No contacts assigned to this site yet</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Site contacts and responsible parties will appear here</p>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Activity Log
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px'
                }}>
                  <Clock size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#1e293b', fontWeight: '500', marginBottom: '0.25rem' }}>Site created</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      By {site.created_by_username || 'System'} • {new Date(site.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {site.updated_at !== site.created_at && (
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px'
                  }}>
                    <Clock size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#1e293b', fontWeight: '500', marginBottom: '0.25rem' }}>Site updated</p>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        By {site.updated_by_username || 'System'} • {new Date(site.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <SiteFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        site={site}
        onSuccess={() => {
          setIsEditModalOpen(false)
          refetch()
        }}
      />
    </AppLayout>
  )
}