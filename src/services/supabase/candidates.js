import { supabase, TABLES, handleSupabaseError } from './client'
import { toast } from 'react-hot-toast'

export const candidatesService = {
  // Récupérer toutes les candidates
  async getAllCandidates() {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .select('*')
        .order('candidate_number', { ascending: true })
      
      if (error) throw error
      
      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Récupérer une candidate par ID
  async getCandidateById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return {
        success: true,
        data
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Mettre à jour le nombre de votes d'une candidate
  async updateVoteCount(candidateId, voteCount) {
    try {
      // Récupérer les votes actuels
      const { data: candidate, error: fetchError } = await supabase
        .from(TABLES.CANDIDATES)
        .select('votes_count')
        .eq('id', candidateId)
        .single()
      
      if (fetchError) throw fetchError
      
      const newVoteCount = (candidate.votes_count || 0) + voteCount
      
      // Mettre à jour
      const { error: updateError } = await supabase
        .from(TABLES.CANDIDATES)
        .update({ 
          votes_count: newVoteCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId)
      
      if (updateError) throw updateError
      
      return {
        success: true,
        data: { votes_count: newVoteCount }
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Récupérer les statistiques des candidates
  async getCandidatesStats() {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .select(`
          *,
          votes:votes(count),
          total_amount:votes(sum(amount_paid))
        `)
        .order('votes_count', { ascending: false })
      
      if (error) throw error
      
      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Écouter les changements en temps réel
  subscribeToCandidates(callback) {
    const subscription = supabase
      .channel('candidates-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.CANDIDATES 
        }, 
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()
    
    return subscription
  },

  // Mettre à jour une candidate (admin)
  async updateCandidate(id, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      toast.success('Candidate mise à jour avec succès')
      
      return {
        success: true,
        data
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Ajouter une nouvelle candidate (admin)
  async addCandidate(candidateData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .insert([{
          ...candidateData,
          votes_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      toast.success('Candidate ajoutée avec succès')
      
      return {
        success: true,
        data
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}