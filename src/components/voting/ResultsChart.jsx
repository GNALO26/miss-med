import React, { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { TrendingUp, Award, Eye, EyeOff } from 'lucide-react'
import { formatCurrency } from '../../services/utils/constants'

const ResultsChart = ({ candidates = [], showVotes = true }) => {
  const [chartType, setChartType] = useState('bar')
  const [showDetails, setShowDetails] = useState(true)

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    return candidates
      .sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
      .map((candidate, index) => ({
        name: `#${candidate.candidate_number}`,
        fullName: candidate.name,
        votes: candidate.votes_count || 0,
        revenue: (candidate.votes_count || 0) * 100,
        rank: index + 1,
        color: getColorByRank(index)
      }))
  }

  const getColorByRank = (rank) => {
    const colors = [
      '#FFD700', // Or
      '#C0C0C0', // Argent
      '#CD7F32', // Bronze
      '#3B82F6', // Bleu
      '#10B981', // Vert
      '#8B5CF6', // Violet
      '#F59E0B', // Orange
      '#EF4444', // Rouge
      '#6366F1', // Indigo
      '#EC4899'  // Rose
    ]
    return colors[rank] || '#6B7280'
  }

  const chartData = prepareChartData()

  // Statistiques globales
  const totalVotes = chartData.reduce((sum, item) => sum + item.votes, 0)
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
  const leader = chartData[0] || null
  const averageVotes = totalVotes / (chartData.length || 1)

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-2">{data.fullName}</h4>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Numéro:</span>
              <span className="font-medium ml-2">{data.name}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Votes:</span>
              <span className="font-medium ml-2">{data.votes.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Collecté:</span>
              <span className="font-medium ml-2">{formatCurrency(data.revenue)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Classement:</span>
              <span className="font-medium ml-2">#{data.rank}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Graphique en barres
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="votes" 
          name="Votes" 
          fill="#3B82F6"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )

  // Graphique circulaire
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${entry.votes}`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="votes"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )

  // Graphique en ligne
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="votes" 
          name="Votes"
          stroke="#3B82F6" 
          strokeWidth={3}
          dot={{ fill: '#3B82F6', r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )

  // Graphique radar
  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData.slice(0, 6)}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis 
          dataKey="name" 
          style={{ fontSize: '12px' }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, Math.max(...chartData.map(d => d.votes))]}
          style={{ fontSize: '10px' }}
        />
        <Radar 
          name="Votes" 
          dataKey="votes" 
          stroke="#3B82F6" 
          fill="#3B82F6" 
          fillOpacity={0.6} 
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart()
      case 'pie':
        return renderPieChart()
      case 'line':
        return renderLineChart()
      case 'radar':
        return renderRadarChart()
      default:
        return renderBarChart()
    }
  }

  if (!showVotes) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-12 text-center">
        <Eye size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Résultats masqués
        </h3>
        <p className="text-gray-600">
          Les résultats seront visibles 14 jours avant la fin du concours
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Résultats en direct</h2>
          <p className="text-gray-600">Classement des candidates par nombre de votes</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title={showDetails ? 'Masquer les détails' : 'Afficher les détails'}
          >
            {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total votes</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalVotes.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Montant total</span>
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-600 text-sm font-medium">Leader</span>
              <Award className="text-yellow-600" size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {leader ? leader.fullName : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              {leader ? `${leader.votes} votes` : ''}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Moyenne</span>
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(averageVotes)}
            </div>
            <div className="text-sm text-gray-600">votes/candidate</div>
          </div>
        </div>
      )}

      {/* Sélecteur de type de graphique */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              chartType === 'bar'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Barres
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              chartType === 'pie'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🥧 Circulaire
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              chartType === 'line'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📈 Ligne
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              chartType === 'radar'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 Radar
          </button>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {chartData.length > 0 ? (
          renderChart()
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        )}
      </div>

      {/* Classement détaillé */}
      {showDetails && chartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Classement détaillé
          </h3>
          
          <div className="space-y-3">
            {chartData.map((candidate, index) => (
              <div
                key={candidate.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: candidate.color }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {candidate.fullName}
                    </div>
                    <div className="text-sm text-gray-600">
                      Candidate {candidate.name}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-primary-600">
                    {candidate.votes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(candidate.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsChart