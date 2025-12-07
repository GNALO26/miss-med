import { supabase, TABLES, handleSupabaseError } from './client'
import { candidatesService } from './candidates'
import { toast } from 'react-hot-toast'

export const votesService = {
  // Enregistrer un vote
  async recordVote(voteData) {
    try {
      const { candidateId, voterInfo, amount, transactionId } = voteData
      
      // 1. Enregistrer le vote
      const { data: vote, error: voteError } = await supabase
        .from(TABLES.VOTES)
        .insert([{
          candidate_id: candidateId,
          voter_name: voterInfo.name,
          voter_email: voterInfo.email,
          voter_phone: voterInfo.phone,
          amount_paid: amount,
          transaction_id: transactionId,
          kkiapay_transaction_id: transactionId,
          payment_status: 'completed',
          vote_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (voteError) throw voteError
      
      // 2. Mettre à jour le compteur de votes de la candidate
      const updateResult = await candidatesService.updateVoteCount(candidateId, 1)
      if (!updateResult.success) {
        throw new Error('Failed to update candidate vote count')
      }
      
      // 3. Enregistrer la transaction
      const { error: transactionError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .insert([{
          type: 'vote',
          reference_id: vote.id,
          amount: amount,
          currency: 'XOF',
          payment_method: 'kkiapay',
          status: 'completed',
          metadata: {
            candidate_id: candidateId,
            voter_name: voterInfo.name,
            transaction_id: transactionId
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      
      if (transactionError) throw transactionError
      
      toast.success('Vote enregistré avec succès! Merci pour votre participation.')
      
      return {
        success: true,
        data: vote
      }
    } catch (error) {
      return handleSupabaseError(error, 'Erreur lors de l\'enregistrement du vote')
    }
  },

  // Vérifier si une transaction existe déjà
  async checkTransactionExists(transactionId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.VOTES)
        .select('id')
        .eq('transaction_id', transactionId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      
      return {
        success: true,
        exists: !!data
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Récupérer les votes d'une candidate
  async getVotesByCandidate(candidateId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.VOTES)
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Récupérer tous les votes (admin)
  async getAllVotes(page = 1, limit = 50) {
    try {
      const start = (page - 1) * limit
      const end = start + limit - 1
      
      const { data, error, count } = await supabase
        .from(TABLES.VOTES)
        .select(`
          *,
          candidate:candidates(name, candidate_number)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end)
      
      if (error) throw error
      
      return {
        success: true,
        data: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Récupérer les statistiques de votes
  async getVotingStats() {
    try {
      // Total des votes
      const { count: totalVotes, error: votesError } = await supabase
        .from(TABLES.VOTES)
        .select('*', { count: 'exact', head: true })
      
      if (votesError) throw votesError
      
      // Montant total collecté
      const { data: totalAmountData, error: amountError } = await supabase
        .from(TABLES.VOTES)
        .select('amount_paid')
      
      if (amountError) throw amountError
      
      const totalAmount = totalAmountData?.reduce((sum, vote) => sum + (vote.amount_paid || 0), 0) || 0
      
      // Nombre de votants uniques
      const { data: uniqueVoters, error: votersError } = await supabase
        .from(TABLES.VOTES)
        .select('voter_email')
      
      if (votersError) throw votersError
      
      const uniqueVotersCount = new Set(uniqueVoters?.map(v => v.voter_email)).size
      
      return {
        success: true,
        data: {
          totalVotes: totalVotes || 0,
          totalAmount,
          uniqueVoters: uniqueVotersCount,
          averageVotesPerVoter: totalVotes ? (totalVotes / uniqueVotersCount).toFixed(2) : 0
        }
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Exporter les votes (admin)
  async exportVotes(format = 'csv') {
    try {
      const { data: votes, error } = await supabase
        .from(TABLES.VOTES)
        .select(`
          *,
          candidate:candidates(name, candidate_number)
        `)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      if (format === 'csv') {
        const headers = ['ID', 'Candidate', 'Numéro', 'Nom votant', 'Email', 'Téléphone', 'Montant', 'Date']
        const csvContent = [
          headers.join(','),
          ...votes.map(vote => [
            vote.id,
            `"${vote.candidate?.name || 'N/A'}"`,
            vote.candidate?.candidate_number || 'N/A',
            `"${vote.voter_name || 'Anonyme'}"`,
            `"${vote.voter_email || ''}"`,
            `"${vote.voter_phone || ''}"`,
            vote.amount_paid,
            new Date(vote.created_at).toLocaleString('fr-FR')
          ].join(','))
        ].join('\n')
        
        return {
          success: true,
          data: csvContent,
          filename: `votes-miss-fss-${new Date().toISOString().split('T')[0]}.csv`
        }
      }
      
      return {
        success: true,
        data: votes
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Écouter les nouveaux votes en temps réel
  subscribeToVotes(callback) {
    const subscription = supabase
      .channel('votes-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: TABLES.VOTES 
        }, 
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()
    
    return subscription
  }
}