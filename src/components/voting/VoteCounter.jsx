import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users, DollarSign, RefreshCw, Activity } from 'lucide-react'
import { formatCurrency } from '../../services/utils/constants'

const VoteCounter = ({ 
  totalVotes = 0, 
  totalAmount = 0, 
  uniqueVoters = 0,
  isLive = false,
  onRefresh 
}) => {
  const [displayVotes, setDisplayVotes] = useState(0)
  const [displayAmount, setDisplayAmount] = useState(0)
  const [displayVoters, setDisplayVoters] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animation du compteur
  useEffect(() => {
    animateCounter(displayVotes, totalVotes, setDisplayVotes)
  }, [totalVotes])

  useEffect(() => {
    animateCounter(displayAmount, totalAmount, setDisplayAmount)
  }, [totalAmount])

  useEffect(() => {
    animateCounter(displayVoters, uniqueVoters, setDisplayVoters)
  }, [uniqueVoters])

  const animateCounter = (start, end, setter) => {
    if (start === end) return

    const duration = 1000 // 1 seconde
    const steps = 30
    const increment = (end - start) / steps
    const stepDuration = duration / steps

    let current = start
    const timer = setInterval(() => {
      current += increment
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setter(end)
        clearInterval(timer)
      } else {
        setter(Math.round(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }

  const handleRefresh = () => {
    setIsAnimating(true)
    if (onRefresh) {
      onRefresh()
    }
    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="text-primary-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">
            Compteur en direct
          </h3>
          {isLive && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>

        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isAnimating}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Actualiser"
          >
            <RefreshCw 
              size={20} 
              className={isAnimating ? 'animate-spin' : ''} 
            />
          </button>
        )}
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total des votes */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233B82F6' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <span className="text-blue-600 text-sm font-medium">Total</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={displayVotes}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-gray-900 mb-1"
              >
                {displayVotes.toLocaleString()}
              </motion.div>
            </AnimatePresence>

            <div className="text-blue-600 font-medium">
              Votes enregistrés
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (displayVotes / 10000) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-blue-600 mt-1 text-right">
              Objectif: 10,000 votes
            </div>
          </div>
        </motion.div>

        {/* Montant collecté */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310B981' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-green-600 text-sm font-medium">Collecté</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={displayAmount}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-1"
              >
                {formatCurrency(displayAmount)}
              </motion.div>
            </AnimatePresence>

            <div className="text-green-600 font-medium">
              Montant total
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (displayAmount / 1000000) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-green-600 mt-1 text-right">
              Objectif: 1,000,000 FCFA
            </div>
          </div>
        </motion.div>

        {/* Votants uniques */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B5CF6' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-purple-600 text-sm font-medium">Participants</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={displayVoters}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-gray-900 mb-1"
              >
                {displayVoters.toLocaleString()}
              </motion.div>
            </AnimatePresence>

            <div className="text-purple-600 font-medium">
              Votants uniques
            </div>

            {/* Average calculation */}
            {displayVoters > 0 && (
              <div className="mt-3 p-2 bg-purple-200/50 rounded-lg">
                <div className="text-xs text-purple-700">
                  Moyenne: <span className="font-bold">
                    {(displayVotes / displayVoters).toFixed(1)} votes/personne
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats supplémentaires */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-primary-600">
            {displayVotes > 0 ? Math.round((displayVoters / displayVotes) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Taux de participation</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-secondary-600">
            100 FCFA
          </div>
          <div className="text-sm text-gray-600">Prix par vote</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {displayVoters > 0 ? formatCurrency(Math.round(displayAmount / displayVoters)) : '0 FCFA'}
          </div>
          <div className="text-sm text-gray-600">Panier moyen</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-accent-600">
            {isLive ? '🔴 LIVE' : '⏸️'}
          </div>
          <div className="text-sm text-gray-600">
            {isLive ? 'En temps réel' : 'Hors ligne'}
          </div>
        </div>
      </div>

      {/* Status */}
      {isLive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200"
        >
          <div className="flex items-center space-x-2 text-blue-800">
            <Activity size={16} className="animate-pulse" />
            <span className="text-sm font-medium">
              Les données sont mises à jour en temps réel
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VoteCounter