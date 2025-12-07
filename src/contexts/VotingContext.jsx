import React, { createContext, useState, useContext, useEffect } from 'react'
import { candidatesService } from '../services/supabase/candidates'
import { votesService } from '../services/supabase/votes'
import { adminService } from '../services/supabase/admin'
import { toast } from 'react-hot-toast'

const VotingContext = createContext({})

export const useVoting = () => {
  const context = useContext(VotingContext)
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider')
  }
  return context
}

export const VotingProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(true)
  const [eventEndDate, setEventEndDate] = useState(null)

  // Charger les données initiales
  useEffect(() => {
    loadInitialData()
    setupRealtimeUpdates()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Charger les candidates
      const candidatesResult = await candidatesService.getAllCandidates()
      if (candidatesResult.success) {
        setCandidates(candidatesResult.data)
      }

      // Charger les paramètres admin
      const settingsResult = await adminService.getAdminSettings()
      if (settingsResult.success) {
        const settings = settingsResult.data
        setShowResults(settings.show_results_public === 'true')
        setEventEndDate(settings.voting_end_date)
      }

      // Charger les statistiques
      await loadStats()
    } catch (error) {
      console.error('Initial data loading error:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsResult = await votesService.getVotingStats()
      if (statsResult.success) {
        setStats(statsResult.data)
      }
    } catch (error) {
      console.error('Stats loading error:', error)
    }
  }

  const setupRealtimeUpdates = () => {
    // Écouter les changements des candidates
    const candidatesSubscription = candidatesService.subscribeToCandidates((payload) => {
      if (payload.eventType === 'UPDATE') {
        setCandidates(prev => 
          prev.map(candidate => 
            candidate.id === payload.new.id ? payload.new : candidate
          )
        )
      }
    })

    // Écouter les nouveaux votes
    const votesSubscription = votesService.subscribeToVotes((payload) => {
      if (payload.eventType === 'INSERT') {
        // Mettre à jour le compteur de votes
        setCandidates(prev =>
          prev.map(candidate => {
            if (candidate.id === payload.new.candidate_id) {
              return {
                ...candidate,
                votes_count: (candidate.votes_count || 0) + 1
              }
            }
            return candidate
          })
        )
        
        // Recharger les statistiques
        loadStats()
      }
    })

    return () => {
      candidatesSubscription.unsubscribe()
      votesSubscription.unsubscribe()
    }
  }

  const getCandidateById = (id) => {
    return candidates.find(c => c.id === id)
  }

  const getTopCandidates = (limit = 3) => {
    return [...candidates]
      .sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
      .slice(0, limit)
  }

  const getCandidatesSorted = () => {
    return [...candidates].sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
  }

  const refreshData = async () => {
    await loadInitialData()
    toast.success('Données actualisées')
  }

  const value = {
    candidates,
    stats,
    loading,
    showResults,
    eventEndDate,
    getCandidateById,
    getTopCandidates,
    getCandidatesSorted,
    refreshData
  }

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  )
}