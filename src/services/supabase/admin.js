import { supabase, TABLES, handleSupabaseError } from './client'
import { toast } from 'react-hot-toast'

export const adminService = {
  // Vérifier les identifiants admin
  async verifyAdminCredentials(username, password) {
    try {
      const adminUsername = import.meta.env.VITE_ADMIN_USERNAME
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
      
      if (!adminUsername || !adminPassword) {
        throw new Error('Configuration admin manquante')
      }
      
      const isValid = username === adminUsername && password === adminPassword
      
      if (!isValid) {
        throw new Error('Identifiants incorrects')
      }
      
      // Créer une session admin
      const session = {
        username,
        role: 'admin',
        loggedInAt: new Date().toISOString(),
        token: btoa(`${username}:${Date.now()}`)
      }
      
      // Stocker la session
      localStorage.setItem('admin_session', JSON.stringify(session))
      
      return {
        success: true,
        data: session
      }
    } catch (error) {
      return handleSupabaseError(error, 'Échec de l\'authentification')
    }
  },

  // Vérifier si l'utilisateur est connecté en tant qu'admin
  async checkAdminSession() {
    try {
      const sessionStr = localStorage.getItem('admin_session')
      if (!sessionStr) {
        return { success: false, authenticated: false }
      }
      
      const session = JSON.parse(sessionStr)
      
      // Vérifier si la session a expiré (24 heures)
      const loginTime = new Date(session.loggedInAt)
      const now = new Date()
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        localStorage.removeItem('admin_session')
        return { success: false, authenticated: false, expired: true }
      }
      
      return {
        success: true,
        authenticated: true,
        data: session
      }
    } catch (error) {
      localStorage.removeItem('admin_session')
      return { success: false, authenticated: false }
    }
  },

  // Déconnecter l'admin
  async logoutAdmin() {
    localStorage.removeItem('admin_session')
    return { success: true }
  },

  // Récupérer les paramètres admin
  async getAdminSettings() {
    try {
      const { data, error } = await supabase
        .from(TABLES.ADMIN_SETTINGS)
        .select('*')
        .order('key', { ascending: true })
      
      if (error) throw error
      
      // Convertir en objet
      const settings = {}
      data?.forEach(setting => {
        settings[setting.key] = setting.value
      })
      
      return {
        success: true,
        data: settings
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Mettre à jour un paramètre admin
  async updateAdminSetting(key, value) {
    try {
      const { error } = await supabase
        .from(TABLES.ADMIN_SETTINGS)
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
      
      if (error) throw error
      
      toast.success('Paramètre mis à jour avec succès')
      
      return { success: true }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Récupérer les statistiques globales
  async getGlobalStats() {
    try {
      // Statistiques des votes
      const { data: votesData, error: votesError } = await supabase
        .from(TABLES.VOTES)
        .select('amount_paid', { count: 'exact' })
      
      if (votesError) throw votesError
      
      const totalVotes = votesData?.length || 0
      const votesRevenue = votesData?.reduce((sum, vote) => sum + (vote.amount_paid || 0), 0) || 0
      
      // Statistiques des billets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from(TABLES.TICKETS)
        .select('total_price', { count: 'exact' })
      
      if (ticketsError) throw ticketsError
      
      const totalTickets = ticketsData?.length || 0
      const ticketsRevenue = ticketsData?.reduce((sum, ticket) => sum + (ticket.total_price || 0), 0) || 0
      
      // Total des transactions
      const totalTransactions = totalVotes + totalTickets
      const totalRevenue = votesRevenue + ticketsRevenue
      
      // Récupérer les 5 dernières transactions
      const { data: recentVotes, error: recentVotesError } = await supabase
        .from(TABLES.VOTES)
        .select(`
          *,
          candidate:candidates(name, candidate_number)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentVotesError) throw recentVotesError
      
      const { data: recentTickets, error: recentTicketsError } = await supabase
        .from(TABLES.TICKETS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentTicketsError) throw recentTicketsError
      
      // Combiner et trier les transactions récentes
      const recentTransactions = [
        ...(recentVotes?.map(vote => ({
          id: vote.id,
          type: 'vote',
          amount: vote.amount_paid,
          description: `Vote pour ${vote.candidate?.name || 'Candidate'} #${vote.candidate?.candidate_number}`,
          date: vote.created_at,
          status: vote.payment_status
        })) || []),
        ...(recentTickets?.map(ticket => ({
          id: ticket.id,
          type: 'ticket',
          amount: ticket.total_price,
          description: `${ticket.quantity}x ${ticket.ticket_type}`,
          date: ticket.created_at,
          status: ticket.payment_status
        })) || [])
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
      
      return {
        success: true,
        data: {
          totals: {
            votes: totalVotes,
            votesRevenue,
            tickets: totalTickets,
            ticketsRevenue,
            transactions: totalTransactions,
            revenue: totalRevenue
          },
          recentTransactions,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Nettoyer les anciennes données (maintenance)
  async cleanupOldData(days = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      // Supprimer les votes non payés plus vieux que X jours
      const { error: votesError } = await supabase
        .from(TABLES.VOTES)
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .eq('payment_status', 'pending')
      
      if (votesError) throw votesError
      
      // Supprimer les billets non payés plus vieux que X jours
      const { error: ticketsError } = await supabase
        .from(TABLES.TICKETS)
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .eq('payment_status', 'pending')
      
      if (ticketsError) throw ticketsError
      
      toast.success(`Données nettoyées (plus vieilles que ${days} jours)`)
      
      return { success: true }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Exporter toutes les données (backup)
  async exportAllData() {
    try {
      const [
        candidates,
        votes,
        tickets,
        transactions,
        settings
      ] = await Promise.all([
        supabase.from(TABLES.CANDIDATES).select('*'),
        supabase.from(TABLES.VOTES).select('*'),
        supabase.from(TABLES.TICKETS).select('*'),
        supabase.from(TABLES.TRANSACTIONS).select('*'),
        supabase.from(TABLES.ADMIN_SETTINGS).select('*')
      ])
      
      const exportData = {
        timestamp: new Date().toISOString(),
        data: {
          candidates: candidates.data || [],
          votes: votes.data || [],
          tickets: tickets.data || [],
          transactions: transactions.data || [],
          settings: settings.data || []
        }
      }
      
      const jsonStr = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      return {
        success: true,
        data: {
          url,
          blob,
          filename: `backup-miss-fss-${new Date().toISOString().split('T')[0]}.json`
        }
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}