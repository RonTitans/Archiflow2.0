import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_staff?: boolean
  is_superuser?: boolean
}

class AuthService {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    // Load tokens from localStorage on init
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token')
      
      // Set default auth header if token exists
      if (this.accessToken) {
        this.setAuthHeader(this.accessToken)
      }
    }
  }

  private setAuthHeader(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  private removeAuthHeader() {
    delete axios.defaults.headers.common['Authorization']
  }

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const response = await axios.post<AuthTokens>(`${API_URL}/auth/login/`, credentials)
      const { access, refresh } = response.data

      // Store tokens
      this.accessToken = access
      this.refreshToken = refresh
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
      }

      // Set auth header
      this.setAuthHeader(access)

      return response.data
    } catch (error) {
      throw new Error('Invalid username or password')
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      if (this.refreshToken) {
        await axios.post(`${API_URL}/auth/logout/`, {
          refresh: this.refreshToken
        })
      }
    } catch (error) {
      // Ignore errors during logout
    } finally {
      // Clear tokens
      this.accessToken = null
      this.refreshToken = null
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }

      // Remove auth header
      this.removeAuthHeader()
    }
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post<{ access: string }>(`${API_URL}/auth/refresh/`, {
        refresh: this.refreshToken
      })

      const { access } = response.data
      this.accessToken = access

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access)
      }

      this.setAuthHeader(access)
      return access
    } catch (error) {
      // Refresh failed, logout user
      await this.logout()
      throw new Error('Session expired. Please login again.')
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.accessToken) {
      return null
    }

    try {
      const response = await axios.get<User>(`${API_URL}/users/me/`)
      return response.data
    } catch (error) {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  setupAxiosInterceptors() {
    // Request interceptor to add token
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle 401 and refresh token
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Skip refresh for auth endpoints to prevent loops
        if (error.config?.url?.includes('/auth/')) {
          return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true

          try {
            await this.refreshAccessToken()
            // Update the authorization header with new token
            originalRequest.headers['Authorization'] = `Bearer ${this.accessToken}`
            return axios(originalRequest)
          } catch (refreshError) {
            // Clear tokens and redirect to login
            this.accessToken = null
            this.refreshToken = null
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              window.location.href = '/auth/login'
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }
}

export default new AuthService()