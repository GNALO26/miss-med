import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'

const AdminLogin = () => {
  const { login, loading } = useAdminAuth()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    const result = await login(credentials.username, credentials.password)
    
    if (!result.success) {
      setError(result.error || 'Identifiants incorrects')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-primary-900 p-4"
    >
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Espace Administrateur
          </h1>
          <p className="text-white/70">
            Accès réservé aux organisateurs de Miss FSS
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ username */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Nom d'utilisateur</span>
                </div>
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="admin"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Champ password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center space-x-2">
                  <Lock size={16} />
                  <span>Mot de passe</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle size={20} className="text-red-400 mt-0.5" />
                  <div className="text-red-100 text-sm">
                    {error}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="text-center text-white/60 text-sm">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield size={16} />
                <span>Accès sécurisé</span>
              </div>
              <p>
                Cet espace est réservé aux administrateurs autorisés.
                Toute tentative d'accès non autorisée sera journalisée.
              </p>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Miss FSS • Développé par GUI-LOK Dev</p>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminLogin