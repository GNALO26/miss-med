import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Trophy, TrendingUp, Eye, EyeOff, Award } from 'lucide-react'
import VotingModal from './VotingModal'
import { formatCurrency } from '../../services/utils/constants'

const CandidateCard = ({ 
  candidate, 
  index, 
  showVotes = true,
  onVoteSuccess 
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const rankColors = [
    'from-yellow-500 to-yellow-600', // 1ère
    'from-gray-400 to-gray-500',     // 2ème
    'from-amber-700 to-amber-800',   // 3ème
    'from-primary-500 to-primary-600' // autres
  ]

  const getRankColor = (index) => {
    return index < 3 ? rankColors[index] : rankColors[3]
  }

  const getRankIcon = (index) => {
    const icons = ['🥇', '🥈', '🥉', '⭐']
    return index < 3 ? icons[index] : icons[3]
  }

  const handleVoteSuccess = () => {
    setIsVotingModalOpen(false)
    if (onVoteSuccess) {
      onVoteSuccess()
    }
  }

  const defaultImage = '/candidates/default.jpg'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative"
      >
        {/* Rank Badge */}
        <div className="absolute -top-3 -left-3 z-10">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">
              {index + 1}
            </span>
          </div>
          <div className="absolute -top-1 -right-1">
            <span className="text-xl">{getRankIcon(index)}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          {/* Candidate Image */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
            {!imageError ? (
              <img
                src={candidate.photo_url || defaultImage}
                alt={`${candidate.name} - Candidate #${candidate.candidate_number}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={64} className="text-primary-300" />
              </div>
            )}
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Candidate Number */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              <span className="font-bold text-primary-600">#{candidate.candidate_number}</span>
            </div>

            {/* Quick Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Trophy size={16} className="text-secondary-500" />
                  <span className="font-bold text-gray-900">{candidate.votes_count || 0}</span>
                  <span className="text-gray-600 text-sm">votes</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                {showDetails ? (
                  <EyeOff size={16} className="text-gray-700" />
                ) : (
                  <Eye size={16} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Candidate Info */}
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {candidate.name}
              </h3>
              <p className="text-gray-600 text-sm">Candidate #{candidate.candidate_number}</p>
            </div>

            {/* Votes Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progression</span>
                <span className="font-semibold text-primary-600">
                  {candidate.votes_count || 0} votes
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((candidate.votes_count || 0) / 1000) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Detailed Stats (Conditionnel) */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      #{candidate.candidate_number}
                    </div>
                    <div className="text-xs text-gray-600">Numéro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600">
                      {formatCurrency((candidate.votes_count || 0) * 100)}
                    </div>
                    <div className="text-xs text-gray-600">Collecté</div>
                  </div>
                </div>
                
                {candidate.description && (
                  <p className="text-gray-700 text-sm mt-3 italic">
                    "{candidate.description}"
                  </p>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsVotingModalOpen(true)}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>Voter</span>
                <TrendingUp size={18} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                {showDetails ? 'Moins' : 'Plus'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voting Modal */}
      <VotingModal
        isOpen={isVotingModalOpen}
        onClose={() => setIsVotingModalOpen(false)}
        candidate={candidate}
        onSuccess={handleVoteSuccess}
      />
    </>
  )
}

// Composant pour le classement
export const RankingCard = ({ candidate, rank }) => {
  const rankColors = [
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-gray-400 to-gray-500',
    'bg-gradient-to-br from-amber-700 to-amber-800',
    'bg-gradient-to-br from-primary-500 to-primary-600'
  ]

  const rankIcons = ['🥇', '🥈', '🥉', '⭐']
  const rankText = ['1ère', '2ème', '3ème', `${rank}ème`]

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Rank */}
      <div className={`w-14 h-14 rounded-full ${rankColors[rank - 1] || rankColors[3]} flex items-center justify-center shadow-lg`}>
        <div className="text-center">
          <div className="text-white font-bold text-lg">{rank}</div>
          <div className="text-xs text-white/80">{rankIcons[rank - 1] || rankIcons[3]}</div>
        </div>
      </div>

      {/* Candidate Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900">{candidate.name}</h4>
            <p className="text-sm text-gray-600">#{candidate.candidate_number}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">{candidate.votes_count}</div>
            <div className="text-xs text-gray-600">votes</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              style={{ width: `${Math.min(100, (candidate.votes_count / 1000) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateCard