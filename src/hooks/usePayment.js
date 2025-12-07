import { useState, useCallback } from 'react'
import kkiapayService from '../services/payment/kkiapay'
import { ticketsService } from '../services/supabase/tickets'
import { downloadTicketPDF } from '../services/pdf/generateTicket'
import { toast } from 'react-hot-toast'

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const purchaseTicket = useCallback(async (ticketType, quantity, buyerInfo) => {
    try {
      setIsProcessing(true)

      // 1. Effectuer le paiement
      const paymentResult = await kkiapayService.processTicketPayment(
        ticketType,
        quantity,
        buyerInfo
      )

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Paiement échoué')
      }

      // 2. Enregistrer le billet
      const ticketResult = await ticketsService.recordTicketPurchase({
        ticketType,
        quantity,
        buyerInfo,
        transactionId: paymentResult.transactionId
      })

      if (!ticketResult.success) {
        throw new Error(ticketResult.error || 'Enregistrement du billet échoué')
      }

      // 3. Télécharger le PDF
      if (ticketResult.data.pdf_blob) {
        await downloadTicketPDF(ticketResult.data, buyerInfo)
      }

      toast.success('Billet acheté avec succès !')
      
      return {
        success: true,
        ticket: ticketResult.data,
        transactionId: paymentResult.transactionId
      }
    } catch (error) {
      console.error('Ticket purchase error:', error)
      toast.error(error.message || 'Erreur lors de l\'achat du billet')
      return {
        success: false,
        error: error.message
      }
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const verifyPayment = useCallback(async (transactionId, type = 'ticket') => {
    try {
      const result = await kkiapayService.verifyTransaction(transactionId)
      return result
    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }, [])

  const generatePaymentLink = useCallback((options) => {
    try {
      const link = kkiapayService.generatePaymentLink(options)
      return {
        success: true,
        link
      }
    } catch (error) {
      console.error('Generate payment link error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }, [])

  const refundPayment = useCallback(async (transactionId) => {
    try {
      setIsProcessing(true)
      const result = await kkiapayService.refundTransaction(transactionId)
      return result
    } catch (error) {
      console.error('Refund error:', error)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    isProcessing,
    purchaseTicket,
    verifyPayment,
    generatePaymentLink,
    refundPayment
  }
}