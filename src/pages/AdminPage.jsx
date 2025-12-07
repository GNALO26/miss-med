import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, Users, Ticket, TrendingUp, Settings,
  Lock, LogOut, Eye, EyeOff, Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AdminLogin from '../components/admin/AdminLogin'
import AdminStats from '../components/admin/AdminStats'
import CandidatesManager from '../components/admin/CandidatesManager'
import TransactionsView from '../components/admin/TransactionsView'
import ResultsChart from '../components/voting/ResultsChart'
import { useVoting } from '../contexts/VotingContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const AdminPage = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth()
  const { candidates, loading: votingLoading } = useVoting()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showResults, setShowResults] = useState(true)

  const tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: <BarChart3 size={20} /> },
    { id: 'candidates', name: 'Candidates', icon: <Users size={20} /> },
    { id: 'transactions', name: 'Transactions', icon: <Ticket size={20} /> },
    { id: 'results', name: 'Résultats', icon: <TrendingUp size={20} /> },
  ]

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      // Redirect non-admins after auth check
      // But don't redirect during initial auth check
    }
  }, [isAdmin, authLoading, navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleToggleResults = () => {
    setShowResults(!showResults)
  }

  // Show login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="xl" message="Vérification des accès..." />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 p-4">
        <AdminLogin />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 page-transition">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Espace Administrateur
                </h1>
                <p className="text-gray-600 text-sm">
                  Gestion et statistiques Miss FSS 2024
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleResults}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                title={showResults ? 'Masquer les résultats' : 'Afficher les résultats'}
              >
                {showResults ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="hidden md:inline">
                  {showResults ? 'Masquer' : 'Afficher'} résultats
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <AdminStats />
            </div>
          )}

          {activeTab === 'candidates' && (
            <div>
              <CandidatesManager />
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <TransactionsView />
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <ResultsChart 
                candidates={candidates} 
                showVotes={showResults}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Warning Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-50 to-yellow-100 border-t border-yellow-200 p-3 no-print">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-yellow-800">
            <Lock size={16} />
            <span className="text-sm font-medium">
              Espace sécurisé - Accès réservé aux administrateurs
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage