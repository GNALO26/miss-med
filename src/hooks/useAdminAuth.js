import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export const useAdminAuth = () => {
  const { isAdmin, loading, login, logout } = useAuth()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      setIsChecking(false)
    }
  }, [loading])

  const loginAdmin = useCallback(async (username, password) => {
    const result = await login(username, password)
    if (result.success) {
      navigate('/admin')
    }
    return result
  }, [login, navigate])

  const logoutAdmin = useCallback(async () => {
    await logout()
    navigate('/')
  }, [logout, navigate])

  const requireAdmin = useCallback((callback) => {
    return (...args) => {
      if (!isAdmin) {
        navigate('/admin')
        return
      }
      return callback(...args)
    }
  }, [isAdmin, navigate])

  return {
    isAdmin,
    loading: loading || isChecking,
    login: loginAdmin,
    logout: logoutAdmin,
    requireAdmin
  }
}