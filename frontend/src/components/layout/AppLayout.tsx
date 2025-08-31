'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, Building2, Users, Network, Dns, 
  FileText, Bell, Settings, ChevronDown, Search,
  Menu, X, Sun, Moon, LogOut, User, Server, Globe
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [expandedMenu, setExpandedMenu] = useState<string>('')

  // Navigation structure
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Organization',
      icon: Building2,
      current: false,
      children: [
        { name: 'Sites', href: '/sites', current: pathname === '/sites' },
        { name: 'Tenants', href: '/tenants', current: pathname === '/tenants' },
        { name: 'Contacts', href: '/contacts', current: pathname === '/contacts' }
      ]
    },
    {
      name: 'DCIM',
      icon: Server,
      current: false,
      children: [
        { name: 'Equipment', href: '/equipment', current: pathname === '/equipment' },
        { name: 'Configurations', href: '/configurations', current: pathname === '/configurations' }
      ]
    },
    {
      name: 'IPAM',
      icon: Network,
      current: false,
      children: [
        { name: 'IP Management', href: '/ipam', current: pathname === '/ipam' },
        { name: 'DNS', href: '/dns', current: pathname === '/dns' }
      ]
    },
    {
      name: 'Operations',
      icon: FileText,
      current: false,
      children: [
        { name: 'Alerts', href: '/alerts', current: pathname === '/alerts' }
      ]
    }
  ]

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? '' : name)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar - Fixed width, full height */}
      <div style={{ 
        width: '260px', 
        backgroundColor: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #334155'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ color: 'white' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>ArchiFlow</h1>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                Network Management
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navigation.map((item) => {
            const isExpanded = expandedMenu === item.name
            const hasChildren = item.children && item.children.length > 0
            const isActive = item.current || (item.children && item.children.some(child => child.current))

            return (
              <div key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: isActive ? '#0ea5e9' : 'transparent',
                        color: isActive ? 'white' : '#cbd5e1',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#334155'
                          e.currentTarget.style.color = 'white'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#cbd5e1'
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <item.icon size={20} style={{ marginRight: '0.75rem' }} />
                        {item.name}
                      </div>
                      <ChevronDown 
                        size={16} 
                        style={{ 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    </button>
                    {isExpanded && (
                      <div style={{ marginTop: '0.25rem' }}>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            style={{
                              display: 'block',
                              padding: '0.5rem 1.5rem 0.5rem 3.5rem',
                              fontSize: '0.875rem',
                              color: child.current ? 'white' : '#94a3b8',
                              backgroundColor: child.current ? '#0ea5e9' : 'transparent',
                              textDecoration: 'none',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              if (!child.current) {
                                e.currentTarget.style.backgroundColor = '#334155'
                                e.currentTarget.style.color = 'white'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!child.current) {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#94a3b8'
                              }
                            }}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: item.current ? 'white' : '#cbd5e1',
                      backgroundColor: item.current ? '#0ea5e9' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (!item.current) {
                        e.currentTarget.style.backgroundColor = '#334155'
                        e.currentTarget.style.color = 'white'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.current) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#cbd5e1'
                      }
                    }}
                  >
                    <item.icon size={20} style={{ marginRight: '0.75rem' }} />
                    {item.name}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid #334155',
          color: '#64748b',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          Version 1.0.0<br />
          © 2025 ArchiFlow
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        overflow: 'hidden'
      }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          flexShrink: 0
        }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '400px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }} 
            />
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0ea5e9'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
              }}
            />
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notifications */}
            <button style={{
              padding: '0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              borderRadius: '6px',
              transition: 'all 0.15s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}>
              <Bell size={20} />
            </button>

            {/* User */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#0ea5e9',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '500' }}>
                {user?.email || 'admin'}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#64748b',
                borderRadius: '6px',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto',
          backgroundColor: '#f8fafc'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout