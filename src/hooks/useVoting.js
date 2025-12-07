import { useState, useCallback } from 'react'
import { votesService } from '../services/supabase/votes'
import kkiapayService from '../services/payment/kkiapay'
import { toast } from 'react-hot-toast'

export const useVoting = () => {
  const [isVoting, setIsVoting] = useState(false)

  const voteForCandidate = useCallback(async (candidateId, voterInfo, voteCount = 1) => {
    try {
      setIsVoting(true)
      
      const totalAmount = 100 * voteCount
      
      // 1. Effectuer le paiement
      const paymentResult = await kkiapayService.processVotePayment(
        candidateId,
        voterInfo,
        totalAmount
      )

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Paiement échoué')
      }

      // 2. Enregistrer le vote
      const voteResult = await votesService.recordVote({
        candidateId,
        voterInfo,
        amount: totalAmount,
        transactionId: paymentResult.transactionId
      })

      if (!voteResult.success) {
        throw new Error(voteResult.error || 'Enregistrement du vote échoué')
      }

      toast.success(`Merci pour vos ${voteCount} vote(s) !`)
      
      return {
        success: true,
        transactionId: paymentResult.transactionId,
        voteId: voteResult.data?.id
      }
    } catch (error) {
      console.error('Voting error:', error)
      toast.error(error.message || 'Erreur lors du vote')
      return {
        success: false,
        error: error.message
      }
    } finally {
      setIsVoting(false)
    }
  }, [])

  const getVoteStats = useCallback(async () => {
    try {
      const result = await votesService.getVotingStats()
      return result
    } catch (error) {
      console.error('Get vote stats error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }, [])

  const checkTransaction = useCallback(async (transactionId) => {
    try {
      const result = await votesService.checkTransactionExists(transactionId)
      return result
    } catch (error) {
      console.error('Check transaction error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }, [])

  return {
    isVoting,
    voteForCandidate,
    getVoteStats,
    checkTransaction
  }
}