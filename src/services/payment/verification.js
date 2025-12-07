import { supabase, TABLES } from '../supabase/client'
import kkiapayService from './kkiapay'
import { toast } from 'react-hot-toast'

export const verificationService = {
  // Vérifier et valider un paiement
  async verifyAndProcessPayment(transactionId, type = 'vote') {
    try {
      // 1. Vérifier auprès de KkiaPay
      const kkiapayResult = await kkiapayService.verifyTransaction(transactionId)
      
      if (!kkiapayResult.success || !kkiapayResult.data.verified) {
        throw new Error('Paiement non vérifié par KkiaPay')
      }
      
      const kkiapayData = kkiapayResult.data
      
      // 2. Vérifier dans la base de données
      let existingRecord
      
      if (type === 'vote') {
        const { data: vote } = await supabase
          .from(TABLES.VOTES)
          .select('*')
          .eq('kkiapay_transaction_id', transactionId)
          .single()
        
        existingRecord = vote
      } else if (type === 'ticket') {
        const { data: ticket } = await supabase
          .from(TABLES.TICKETS)
          .select('*')
          .eq('kkiapay_transaction_id', transactionId)
          .single()
        
        existingRecord = ticket
      }
      
      // 3. Si enregistrement existe déjà, vérifier son statut
      if (existingRecord) {
        if (existingRecord.payment_status === 'completed') {
          toast.info('Cette transaction a déjà été traitée')
          return {
            success: true,
            alreadyProcessed: true,
            data: existingRecord
          }
        } else {
          // Mettre à jour le statut
          const table = type === 'vote' ? TABLES.VOTES : TABLES.TICKETS
          const { error: updateError } = await supabase
            .from(table)
            .update({
              payment_status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingRecord.id)
          
          if (updateError) throw updateError
          
          toast.success('Paiement confirmé et mis à jour')
          
          return {
            success: true,
            data: { ...existingRecord, payment_status: 'completed' }
          }
        }
      }
      
      // 4. Si nouveau paiement, extraire les données
      const paymentData = kkiapayData.data || {}
      
      return {
        success: true,
        isNew: true,
        data: {
          transactionId,
          kkiapayData,
          metadata: paymentData
        }
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      
      // En cas d'échec de vérification KkiaPay, on peut quand même vérifier localement
      try {
        if (type === 'vote') {
          const { data: localVote } = await supabase
            .from(TABLES.VOTES)
            .select('*')
            .eq('transaction_id', transactionId)
            .single()
          
          if (localVote) {
            return {
              success: true,
              localVerification: true,
              data: localVote
            }
          }
        }
      } catch (localError) {
        // Ignorer l'erreur locale
      }
      
      toast.error('Impossible de vérifier le paiement')
      
      return {
        success: false,
        error: error.message
      }
    }
  },
  
  // Vérifier le statut de plusieurs transactions
  async batchVerifyTransactions(transactionIds, type = 'vote') {
    try {
      const results = []
      
      for (const transactionId of transactionIds) {
        try {
          const result = await this.verifyAndProcessPayment(transactionId, type)
          results.push({
            transactionId,
            success: result.success,
            data: result.data
          })
        } catch (error) {
          results.push({
            transactionId,
            success: false,
            error: error.message
          })
        }
      }
      
      return {
        success: true,
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  
  // Vérifier les transactions en attente
  async checkPendingTransactions(type = 'vote', hours = 24) {
    try {
      const cutoffTime = new Date()
      cutoffTime.setHours(cutoffTime.getHours() - hours)
      
      const table = type === 'vote' ? TABLES.VOTES : TABLES.TICKETS
      
      const { data: pendingRecords, error } = await supabase
        .from(table)
        .select('*')
        .eq('payment_status', 'pending')
        .lt('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      // Vérifier chaque transaction en attente
      const verificationResults = []
      
      for (const record of pendingRecords || []) {
        try {
          const transactionId = record.transaction_id || record.kkiapay_transaction_id
          if (transactionId) {
            const result = await this.verifyAndProcessPayment(transactionId, type)
            verificationResults.push({
              recordId: record.id,
              transactionId,
              result
            })
          }
        } catch (recordError) {
          verificationResults.push({
            recordId: record.id,
            success: false,
            error: recordError.message
          })
        }
      }
      
      return {
        success: true,
        data: {
          pendingCount: pendingRecords?.length || 0,
          verifications: verificationResults
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  
  // Générer un rapport de vérification
  async generateVerificationReport(startDate, endDate) {
    try {
      const [votes, tickets, transactions] = await Promise.all([
        supabase
          .from(TABLES.VOTES)
          .select('*')
          .gte('created_at', startDate)
          .lte('created_at', endDate),
        
        supabase
          .from(TABLES.TICKETS)
          .select('*')
          .gte('created_at', startDate)
          .lte('created_at', endDate),
        
        supabase
          .from(TABLES.TRANSACTIONS)
          .select('*')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
      ])
      
      const report = {
        period: { startDate, endDate },
        generatedAt: new Date().toISOString(),
        totals: {
          votes: votes.data?.length || 0,
          tickets: tickets.data?.length || 0,
          transactions: transactions.data?.length || 0
        },
        byStatus: {
          votes: {
            completed: votes.data?.filter(v => v.payment_status === 'completed').length || 0,
            pending: votes.data?.filter(v => v.payment_status === 'pending').length || 0,
            failed: votes.data?.filter(v => v.payment_status === 'failed').length || 0
          },
          tickets: {
            completed: tickets.data?.filter(t => t.payment_status === 'completed').length || 0,
            pending: tickets.data?.filter(t => t.payment_status === 'pending').length || 0,
            failed: tickets.data?.filter(t => t.payment_status === 'failed').length || 0
          }
        },
        revenue: {
          votes: votes.data?.reduce((sum, v) => sum + (v.amount_paid || 0), 0) || 0,
          tickets: tickets.data?.reduce((sum, t) => sum + (t.total_price || 0), 0) || 0,
          total: 0
        }
      }
      
      report.revenue.total = report.revenue.votes + report.revenue.tickets
      
      return {
        success: true,
        data: report
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}