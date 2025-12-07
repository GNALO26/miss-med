import React, { createContext, useState, useContext, useEffect } from 'react'
import { adminService } from '../services/supabase/admin'
import { toast } from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Vérifier la session au chargement
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const result = await adminService.checkAdminSession()
      
      if (result.success && result.authenticated) {
        setUser(result.data)
        setIsAdmin(true)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Session check error:', error)
      setUser(null)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      setLoading(true)
      const result = await adminService.verifyAdminCredentials(username, password)
      
      if (result.success) {
        setUser(result.data)
        setIsAdmin(true)
        toast.success('Connexion réussie')
        return { success: true }
      } else {
        throw new Error(result.error || 'Échec de la connexion')
      }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await adminService.logoutAdmin()
      setUser(null)
      setIsAdmin(false)
      toast.success('Déconnexion réussie')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
    checkSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}