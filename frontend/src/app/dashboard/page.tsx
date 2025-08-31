'use client'

import React from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Link from 'next/link'
import { 
  Building2, 
  Server, 
  Network, 
  Settings, 
  FileCode, 
  AlertTriangle,
  Users,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Database,
  Wifi,
  Shield
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  // Statistics cards
  const stats = [
    { 
      label: 'Total Sites', 
      value: '12', 
      change: '+2', 
      changeType: 'increase',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Active Equipment', 
      value: '384', 
      change: '+15', 
      changeType: 'increase',
      icon: Server,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'IP Utilization', 
      value: '67%', 
      change: '+5%', 
      changeType: 'increase',
      icon: Network,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Active Alerts', 
      value: '3', 
      change: '-2', 
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  // Quick access modules
  const quickAccess = [
    { name: 'Sites', icon: Building2, href: '/sites', description: 'Manage locations' },
    { name: 'Equipment', icon: Server, href: '/equipment', description: 'Track devices' },
    { name: 'IP Management', icon: Network, href: '/ipam', description: 'IPAM & DNS' },
    { name: 'Configurations', icon: FileCode, href: '/configurations', description: 'Config templates' },
    { name: 'Contacts', icon: Users, href: '/contacts', description: 'Team members' },
    { name: 'Alerts', icon: AlertTriangle, href: '/alerts', description: 'View alerts' },
  ]

  // Recent activities
  const recentActivities = [
    { type: 'site', action: 'created', name: 'Asia Pacific DC', time: '2 hours ago', icon: Building2, color: 'text-blue-600' },
    { type: 'equipment', action: 'added', name: 'Core Switch #12', time: '5 hours ago', icon: Server, color: 'text-green-600' },
    { type: 'ip', action: 'allocated', name: '10.10.50.0/24', time: '1 day ago', icon: Network, color: 'text-purple-600' },
    { type: 'alert', action: 'resolved', name: 'High CPU Usage', time: '2 days ago', icon: CheckCircle, color: 'text-green-600' },
  ]

  // System health
  const systemHealth = [
    { name: 'Database', status: 'operational', icon: Database },
    { name: 'Network', status: 'operational', icon: Wifi },
    { name: 'Security', status: 'operational', icon: Shield },
    { name: 'API', status: 'operational', icon: Globe },
  ]

  return (
    <ProtectedRoute>
      <AppLayout>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100%' }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              Welcome back, {user?.email?.split('@')[0] || 'Admin'}
            </h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Here's what's happening with your network infrastructure today.
            </p>
          </div>

          {/* Statistics Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                        {stat.label}
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '0.5rem 0' }}>
                        {stat.value}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp size={16} style={{ 
                          color: stat.changeType === 'increase' ? '#10b981' : '#ef4444'
                        }} />
                        <span style={{ 
                          fontSize: '0.875rem',
                          color: stat.changeType === 'increase' ? '#10b981' : '#ef4444'
                        }}>
                          {stat.change}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          from last week
                        </span>
                      </div>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stat.bgColor
                    }}>
                      <Icon size={24} className={stat.color} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Quick Access */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Quick Access
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {quickAccess.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.name} href={item.href} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9'
                      e.currentTarget.style.borderColor = '#0ea5e9'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} style={{ color: '#0ea5e9' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b', margin: 0 }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Recent Activity
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} className={activity.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#1e293b', margin: 0 }}>
                          <span style={{ fontWeight: '500' }}>{activity.name}</span>
                          {' '}{activity.action}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              System Health
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {systemHealth.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '6px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0'
                  }}>
                    <Icon size={20} style={{ color: '#10b981' }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b', margin: 0 }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#10b981', margin: 0 }}>
                        {item.status}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}