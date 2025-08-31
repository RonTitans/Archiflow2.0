'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import authService, { User, AuthTokens } from '@/services/auth.service'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    authService.setupAxiosInterceptors()
  }, [])

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      await authService.login({ username, password })
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshToken = async () => {
    try {
      await authService.refreshAccessToken()
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}