import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, TrendingUp, Search, Filter, SortAsc, 
  Star, Award, Crown, AlertCircle 
} from 'lucide-react'
import { useVoting } from '../contexts/VotingContext'
import CandidateCard from '../components/voting/CandidateCard'
import ResultsChart from '../components/voting/ResultsChart'
import VoteCounter from '../components/voting/VoteCounter'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { adminService } from '../services/supabase/admin'

const VotingPage = () => {
  const { candidates, loading, refreshCandidates, getTopCandidates } = useVoting()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('votes') // 'votes', 'number', 'name'
  const [showChart, setShowChart] = useState(true)
  const [votingStats, setVotingStats] = useState(null)
  const [showResults, setShowResults] = useState(true)
  const [daysUntilEnd, setDaysUntilEnd] = useState(0)

  useEffect(() => {
    loadVotingStats()
    calculateDaysUntilEnd()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshCandidates()
      loadVotingStats()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const loadVotingStats = async () => {
    try {
      const result = await adminService.getGlobalStats()
      if (result.success && result.data) {
        setVotingStats(result.data.totals)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const calculateDaysUntilEnd = () => {
    const eventDate = new Date('2026-01-23')
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 14))
    setDaysUntilEnd(diffDays)

    // Hide results 14 days before event
    setShowResults(diffDays > 14)
  }

  const filteredAndSortedCandidates = () => {
    let filtered = [...candidates]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.candidate_number.toString().includes(searchTerm)
      )
    }

    // Sort
    switch (sortBy) {
      case 'votes':
        filtered.sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
        break
      case 'number':
        filtered.sort((a, b) => a.candidate_number - b.candidate_number)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return filtered
  }

  const topCandidates = getTopCandidates(3)
  const displayCandidates = filteredAndSortedCandidates()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" message="Chargement des candidates..." />
      </div>
    )
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container-custom py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Trophy className="text-secondary-300" size={20} />
              <span className="text-sm font-medium">Votez pour votre favorite</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Votez maintenant !
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Chaque vote compte ! Soutenez votre candidate préférée avec un vote à 100 FCFA.
              Vous pouvez voter autant de fois que vous le souhaitez.
            </motion.p>

            {/* Results visibility notice */}
            {!showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto border border-yellow-300/30"
              >
                <div className="flex items-center justify-center space-x-2 text-yellow-100">
                  <AlertCircle size={20} />
                  <span className="font-medium">
                    Les résultats seront masqués {daysUntilEnd} jours avant la finale
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Vote Counter */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom py-8 px-4 sm:px-6 lg:px-8">
          <VoteCounter
            totalVotes={votingStats?.votes || 0}
            totalAmount={votingStats?.votesAmount || 0}
            uniqueVoters={votingStats?.uniqueVoters || 0}
            isLive={true}
            onRefresh={loadVotingStats}
          />
        </div>
      </div>

      {/* Top 3 Podium */}
      {showResults && topCandidates.length > 0 && (
        <div className="bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Le Podium Actuel
              </h2>
              <p className="text-gray-600">Les 3 candidates en tête</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topCandidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Position Badge */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      'bg-gradient-to-br from-amber-600 to-amber-700'
                    }`}>
                      {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  </div>

                  <div className="pt-10">
                    <CandidateCard
                      candidate={candidate}
                      index={index}
                      showVotes={showResults}
                      onVoteSuccess={refreshCandidates}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Chart */}
      {showChart && showResults && (
        <div className="bg-white py-12">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <ResultsChart 
              candidates={candidates}
              showVotes={showResults}
            />
          </div>
        </div>
      )}

      {/* All Candidates */}
      <div className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          {/* Controls */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Toutes les Candidates
                </h2>
                <p className="text-gray-600">
                  {displayCandidates.length} candidate(s) au total
                </p>
              </div>

              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <TrendingUp size={18} />
                <span>{showChart ? 'Masquer' : 'Afficher'} les graphiques</span>
              </button>
            </div>

            {/* Search and Sort */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="votes">Trier par votes (décroissant)</option>
                  <option value="number">Trier par numéro</option>
                  <option value="name">Trier par nom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates Grid */}
          {displayCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCandidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  index={index}
                  showVotes={showResults}
                  onVoteSuccess={refreshCandidates}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <Search size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Aucune candidate trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de modifier votre recherche ou vos filtres
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
          <Star size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Votez maintenant et faites la différence !
          </h2>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Chaque vote compte pour soutenir votre candidate favorite.
            Le vote est illimité, alors n'hésitez pas !
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <div className="text-3xl font-bold">100 FCFA</div>
              <div className="text-white/80">par vote</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <div className="text-3xl font-bold">∞</div>
              <div className="text-white/80">votes illimités</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotingPage