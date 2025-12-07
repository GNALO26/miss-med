import React, { useState, useEffect } from 'react'
import { 
  BarChart3, Users, TrendingUp, DollarSign, 
  Calendar, Download, RefreshCw, Eye, EyeOff 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell, LineChart, Line 
} from 'recharts'
import { votesService } from '../../services/supabase/votes'
import { ticketsService } from '../../services/supabase/tickets'
import { adminService } from '../../services/supabase/admin'
import { formatCurrency } from '../../services/utils/constants'
import { toast } from 'react-hot-toast'

const AdminStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [showVotesChart, setShowVotesChart] = useState(true)
  const [showTicketsChart, setShowTicketsChart] = useState(true)

  const loadStats = async () => {
    try {
      setLoading(true)
      
      const [votesResult, ticketsResult, globalResult] = await Promise.all([
        votesService.getVotingStats(),
        ticketsService.getTicketStats(),
        adminService.getGlobalStats()
      ])

      setStats({
        votes: votesResult.success ? votesResult.data : null,
        tickets: ticketsResult.success ? ticketsResult.data : null,
        global: globalResult.success ? globalResult.data : null
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTimeRangeData = () => {
    if (!stats?.global?.recentTransactions) return []
    
    const now = new Date()
    let filtered = [...stats.global.recentTransactions]
    
    switch (timeRange) {
      case 'today':
        filtered = filtered.filter(t => {
          const date = new Date(t.date)
          return date.toDateString() === now.toDateString()
        })
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(t => new Date(t.date) >= monthAgo)
        break
    }
    
    return filtered
  }

  const getChartData = () => {
    if (!stats?.votes || !stats?.tickets) return []
    
    return [
      { name: 'Votes', value: stats.votes.totalVotes || 0, color: '#3B82F6' },
      { name: 'Billets', value: stats.tickets.totalTickets || 0, color: '#10B981' },
      { name: 'Montant Votes', value: (stats.votes.totalAmount || 0) / 1000, color: '#8B5CF6' },
      { name: 'Montant Billets', value: (stats.tickets.totalAmount || 0) / 1000, color: '#F59E0B' }
    ]
  }

  const getTicketsByTypeData = () => {
    if (!stats?.tickets?.ticketsByType) return []
    
    return Object.entries(stats.tickets.ticketsByType).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: data.count || 0,
      revenue: data.revenue || 0,
      color: {
        single: '#3B82F6',
        couple: '#10B981',
        group: '#8B5CF6',
        vip: '#F59E0B'
      }[type] || '#6B7280'
    }))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
          <p className="text-gray-600">
            Statistiques en temps réel de l'événement
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="all">Tout</option>
          </select>
          
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Actualiser</span>
          </button>
          
          <button
            onClick={() => adminService.exportAllData().then(result => {
              if (result.success) {
                const link = document.createElement('a')
                link.href = result.data.url
                link.download = result.data.filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-blue-600 font-medium">Votes</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.votes?.totalVotes?.toLocaleString() || '0'}
          </div>
          <div className="text-gray-600">
            {formatCurrency(stats?.votes?.totalAmount || 0)}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">Billets</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.tickets?.totalTickets?.toLocaleString() || '0'}
          </div>
          <div className="text-gray-600">
            {formatCurrency(stats?.tickets?.totalAmount || 0)}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-sm text-purple-600 font-medium">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency((stats?.votes?.totalAmount || 0) + (stats?.tickets?.totalAmount || 0))}
          </div>
          <div className="text-gray-600">
            Montant total collecté
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <span className="text-sm text-yellow-600 font-medium">Transactions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.global?.totals?.transactions?.toLocaleString() || '0'}
          </div>
          <div className="text-gray-600">
            Dernières 24h: {getTimeRangeData().length}
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des votes/billets */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Répartition</h3>
            <button
              onClick={() => setShowVotesChart(!showVotesChart)}
              className="text-gray-600 hover:text-gray-900"
            >
              {showVotesChart ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {showVotesChart && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name.includes('Montant')) return `${value}k FCFA`
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" name="Quantité" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Graphique des types de billets */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Billets par type</h3>
            <button
              onClick={() => setShowTicketsChart(!showTicketsChart)}
              className="text-gray-600 hover:text-gray-900"
            >
              {showTicketsChart ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {showTicketsChart && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getTicketsByTypeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getTicketsByTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'value') {
                        return [`${value} billets`, 'Quantité']
                      }
                      return [value, name]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Transactions récentes */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Transactions récentes
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Montant</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {getTimeRangeData().map((transaction, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      transaction.type === 'vote' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      <span>
                        {transaction.type === 'vote' ? '🗳️' : '🎫'}
                      </span>
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? '✅' : '⏳'}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {getTimeRangeData().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune transaction pour cette période
          </div>
        )}
      </div>

      {/* Résumé détaillé */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé détaillé</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Votes</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Total des votes</span>
                <span className="font-medium">{stats?.votes?.totalVotes?.toLocaleString() || '0'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Votants uniques</span>
                <span className="font-medium">{stats?.votes?.uniqueVoters?.toLocaleString() || '0'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Moyenne par votant</span>
                <span className="font-medium">{stats?.votes?.averageVotesPerVoter || '0'}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Billets</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Total billets</span>
                <span className="font-medium">{stats?.tickets?.totalTickets?.toLocaleString() || '0'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Prix moyen</span>
                <span className="font-medium">{formatCurrency(stats?.tickets?.averageTicketPrice || 0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Personnes totales</span>
                <span className="font-medium">
                  {getTicketsByTypeData().reduce((sum, ticket) => {
                    const capacity = {
                      single: 1,
                      couple: 2,
                      group: 5,
                      vip: 1
                    }[ticket.name.toLowerCase()] || 1
                    return sum + (ticket.value * capacity)
                  }, 0)}
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Finances</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Total collecté</span>
                <span className="font-medium text-green-600">
                  {formatCurrency((stats?.votes?.totalAmount || 0) + (stats?.tickets?.totalAmount || 0))}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Votes</span>
                <span className="font-medium">{formatCurrency(stats?.votes?.totalAmount || 0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Billets</span>
                <span className="font-medium">{formatCurrency(stats?.tickets?.totalAmount || 0)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStats