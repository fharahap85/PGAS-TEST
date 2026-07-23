import { createContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '@/services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('pgas_token')
    const savedUser = localStorage.getItem('pgas_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await authAPI.login({ email, password })
    const { token: newToken, user: userData } = response.data.data

    localStorage.setItem('pgas_token', newToken)
    localStorage.setItem('pgas_user', JSON.stringify(userData))

    setToken(newToken)
    setUser(userData)

    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('pgas_token')
    localStorage.removeItem('pgas_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
