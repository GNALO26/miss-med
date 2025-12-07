import { supabase, TABLES, handleSupabaseError } from './client'
import { generateTicketPDF } from '../pdf/generateTicket'
import { toast } from 'react-hot-toast'

const TICKET_TYPES = {
  SINGLE: {
    type: 'single',
    name: 'Billet 1 Personne',
    price: 12000,
    capacity: 1,
    description: 'Accès standard pour 1 personne'
  },
  COUPLE: {
    type: 'couple',
    name: 'Billet Couple',
    price: 20000,
    capacity: 2,
    description: 'Accès pour 2 personnes'
  },
  GROUP: {
    type: 'group',
    name: 'Billet Groupe (5 personnes)',
    price: 51000,
    capacity: 5,
    description: 'Accès pour un groupe de 5 personnes'
  },
  VIP: {
    type: 'vip',
    name: 'Billet VIP',
    price: 15000,
    capacity: 1,
    description: 'Accès VIP avec avantages exclusifs'
  }
}

export const ticketsService = {
  // Récupérer tous les types de billets
  getTicketTypes() {
    return Object.values(TICKET_TYPES)
  },

  // Récupérer un type de billet par son type
  getTicketType(type) {
    return TICKET_TYPES[type.toUpperCase()]
  },

  // Enregistrer un achat de billet
  async recordTicketPurchase(ticketData) {
    try {
      const { ticketType, quantity, buyerInfo, transactionId } = ticketData
      
      const ticketConfig = this.getTicketType(ticketType)
      if (!ticketConfig) {
        throw new Error('Type de billet invalide')
      }
      
      const totalPrice = ticketConfig.price * quantity
      
      // 1. Enregistrer le billet
      const { data: ticket, error: ticketError } = await supabase
        .from(TABLES.TICKETS)
        .insert([{
          ticket_type: ticketType,
          quantity: quantity,
          unit_price: ticketConfig.price,
          total_price: totalPrice,
          buyer_name: buyerInfo.name,
          buyer_email: buyerInfo.email,
          buyer_phone: buyerInfo.phone,
          transaction_id: transactionId,
          kkiapay_transaction_id: transactionId,
          payment_status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (ticketError) throw ticketError
      
      // 2. Générer le PDF
      const pdfData = await generateTicketPDF(ticket, buyerInfo)
      
      // 3. Mettre à jour le billet avec l'URL du PDF
      const { error: updateError } = await supabase
        .from(TABLES.TICKETS)
        .update({
          pdf_url: pdfData.url,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticket.id)
      
      if (updateError) throw updateError
      
      // 4. Enregistrer la transaction
      const { error: transactionError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .insert([{
          type: 'ticket',
          reference_id: ticket.id,
          amount: totalPrice,
          currency: 'XOF',
          payment_method: 'kkiapay',
          status: 'completed',
          metadata: {
            ticket_type: ticketType,
            quantity: quantity,
            buyer_name: buyerInfo.name,
            transaction_id: transactionId
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      
      if (transactionError) throw transactionError
      
      toast.success('Billet acheté avec succès! Votre PDF est en cours de génération.')
      
      return {
        success: true,
        data: {
          ...ticket,
          pdf_url: pdfData.url,
          pdf_blob: pdfData.blob
        }
      }
    } catch (error) {
      return handleSupabaseError(error, 'Erreur lors de l\'achat du billet')
    }
  },

  // Récupérer un billet par ID
  async getTicketById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TICKETS)
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

  // Récupérer les billets d'un acheteur par email
  async getTicketsByEmail(email) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TICKETS)
        .select('*')
        .eq('buyer_email', email)
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

  // Récupérer tous les billets (admin)
  async getAllTickets(page = 1, limit = 50) {
    try {
      const start = (page - 1) * limit
      const end = start + limit - 1
      
      const { data, error, count } = await supabase
        .from(TABLES.TICKETS)
        .select('*', { count: 'exact' })
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

  // Récupérer les statistiques de billetterie
  async getTicketStats() {
    try {
      // Total des billets vendus
      const { count: totalTickets, error: ticketsError } = await supabase
        .from(TABLES.TICKETS)
        .select('*', { count: 'exact', head: true })
      
      if (ticketsError) throw ticketsError
      
      // Montant total collecté
      const { data: tickets, error: dataError } = await supabase
        .from(TABLES.TICKETS)
        .select('total_price, ticket_type, quantity')
      
      if (dataError) throw dataError
      
      let totalAmount = 0
      const ticketsByType = {}
      
      tickets?.forEach(ticket => {
        totalAmount += ticket.total_price || 0
        
        if (!ticketsByType[ticket.ticket_type]) {
          ticketsByType[ticket.ticket_type] = {
            count: 0,
            revenue: 0,
            quantity: 0
          }
        }
        
        ticketsByType[ticket.ticket_type].count += 1
        ticketsByType[ticket.ticket_type].revenue += ticket.total_price || 0
        ticketsByType[ticket.ticket_type].quantity += ticket.quantity || 1
      })
      
      return {
        success: true,
        data: {
          totalTickets: totalTickets || 0,
          totalAmount,
          ticketsByType,
          averageTicketPrice: totalTickets ? (totalAmount / totalTickets).toFixed(2) : 0
        }
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Marquer un billet comme utilisé
  async markTicketAsUsed(ticketId) {
    try {
      const { error } = await supabase
        .from(TABLES.TICKETS)
        .update({
          is_used: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
      
      if (error) throw error
      
      toast.success('Billet marqué comme utilisé')
      
      return { success: true }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Exporter les billets (admin)
  async exportTickets(format = 'csv') {
    try {
      const { data: tickets, error } = await supabase
        .from(TABLES.TICKETS)
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      if (format === 'csv') {
        const headers = ['ID', 'Type', 'Quantité', 'Prix unitaire', 'Prix total', 'Acheteur', 'Email', 'Téléphone', 'Statut', 'Date']
        const csvContent = [
          headers.join(','),
          ...tickets.map(ticket => [
            ticket.id,
            this.getTicketType(ticket.ticket_type)?.name || ticket.ticket_type,
            ticket.quantity,
            ticket.unit_price,
            ticket.total_price,
            `"${ticket.buyer_name}"`,
            `"${ticket.buyer_email}"`,
            `"${ticket.buyer_phone}"`,
            ticket.payment_status,
            new Date(ticket.created_at).toLocaleString('fr-FR')
          ].join(','))
        ].join('\n')
        
        return {
          success: true,
          data: csvContent,
          filename: `billets-miss-fss-${new Date().toISOString().split('T')[0]}.csv`
        }
      }
      
      return {
        success: true,
        data: tickets
      }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Écouter les nouveaux billets en temps réel
  subscribeToTickets(callback) {
    const subscription = supabase
      .channel('tickets-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: TABLES.TICKETS 
        }, 
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()
    
    return subscription
  }
}