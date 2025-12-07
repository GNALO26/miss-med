import { toast } from 'react-hot-toast'

class KkiapayService {
  constructor() {
    this.publicKey = import.meta.env.VITE_KKIAPAY_PUBLIC_KEY
    this.privateKey = import.meta.env.VITE_KKIAPAY_PRIVATE_KEY
    this.secret = import.meta.env.VITE_KKIAPAY_SECRET
    
    if (!this.publicKey || !this.privateKey || !this.secret) {
      console.warn('KkiaPay keys not configured')
    }
    
    this.initializeKkiapay()
  }
  
  initializeKkiapay() {
    if (typeof window !== 'undefined' && window.Kkiapay) {
      this.kkiapay = window.Kkiapay
    } else {
      console.warn('KkiaPay SDK not loaded')
    }
  }
  
  // Configurer KkiaPay
  configure(options = {}) {
    if (!this.kkiapay) {
      throw new Error('KkiaPay SDK not initialized')
    }
    
    const config = {
      api_key: this.publicKey,
      ...options
    }
    
    return config
  }
  
  // Effectuer un paiement pour un vote
  async processVotePayment(candidateId, voterInfo, amount = 100) {
    try {
      return new Promise((resolve, reject) => {
        if (!this.kkiapay) {
          reject(new Error('KkiaPay SDK not available'))
          return
        }
        
        const transactionId = `VOTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const paymentOptions = {
          amount,
          phone: voterInfo.phone,
          name: voterInfo.name,
          email: voterInfo.email,
          data: {
            candidate_id: candidateId,
            transaction_type: 'vote',
            voter_name: voterInfo.name,
            transaction_id: transactionId
          },
          callback: async (response) => {
            if (response.status === 'SUCCESS') {
              resolve({
                success: true,
                transactionId: response.transaction_id || transactionId,
                data: response
              })
            } else {
              reject(new Error(`Payment failed: ${response.message || 'Unknown error'}`))
            }
          },
          onError: (error) => {
            reject(new Error(`Payment error: ${error.message || 'Unknown error'}`))
          }
        }
        
        // Ouvrir le widget de paiement
        this.kkiapay.open(paymentOptions)
      })
    } catch (error) {
      console.error('Payment processing error:', error)
      toast.error('Erreur lors du traitement du paiement')
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Effectuer un paiement pour un billet
  async processTicketPayment(ticketType, quantity, buyerInfo) {
    try {
      const ticketPrices = {
        single: 12000,
        couple: 20000,
        group: 51000,
        vip: 15000
      }
      
      const unitPrice = ticketPrices[ticketType]
      if (!unitPrice) {
        throw new Error('Invalid ticket type')
      }
      
      const totalAmount = unitPrice * quantity
      
      return new Promise((resolve, reject) => {
        if (!this.kkiapay) {
          reject(new Error('KkiaPay SDK not available'))
          return
        }
        
        const transactionId = `TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const paymentOptions = {
          amount: totalAmount,
          phone: buyerInfo.phone,
          name: buyerInfo.name,
          email: buyerInfo.email,
          data: {
            ticket_type: ticketType,
            quantity,
            unit_price: unitPrice,
            total_amount: totalAmount,
            buyer_name: buyerInfo.name,
            transaction_id: transactionId
          },
          callback: async (response) => {
            if (response.status === 'SUCCESS') {
              resolve({
                success: true,
                transactionId: response.transaction_id || transactionId,
                data: response,
                amount: totalAmount
              })
            } else {
              reject(new Error(`Payment failed: ${response.message || 'Unknown error'}`))
            }
          },
          onError: (error) => {
            reject(new Error(`Payment error: ${error.message || 'Unknown error'}`))
          }
        }
        
        // Ouvrir le widget de paiement
        this.kkiapay.open(paymentOptions)
      })
    } catch (error) {
      console.error('Ticket payment error:', error)
      toast.error('Erreur lors du paiement du billet')
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Vérifier le statut d'une transaction
  async verifyTransaction(transactionId) {
    try {
      if (!this.secret) {
        throw new Error('KkiaPay secret not configured')
      }
      
      const response = await fetch(`https://api.kkiapay.me/api/v1/transactions/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-SECRET-KEY': this.secret,
          'X-API-KEY': this.publicKey,
          'X-PRIVATE-KEY': this.privateKey
        }
      })
      
      if (!response.ok) {
        throw new Error(`Verification failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        success: true,
        data: {
          ...data,
          verified: data.status === 'SUCCESS'
        }
      }
    } catch (error) {
      console.error('Transaction verification error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Rembourser une transaction
  async refundTransaction(transactionId) {
    try {
      if (!this.secret) {
        throw new Error('KkiaPay secret not configured')
      }
      
      const response = await fetch(`https://api.kkiapay.me/api/v1/transactions/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-SECRET-KEY': this.secret,
          'X-API-KEY': this.publicKey,
          'X-PRIVATE-KEY': this.privateKey
        }
      })
      
      if (!response.ok) {
        throw new Error(`Refund failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      toast.success('Remboursement effectué avec succès')
      
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Refund error:', error)
      toast.error('Erreur lors du remboursement')
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Générer un lien de paiement
  generatePaymentLink(options) {
    if (!this.publicKey) {
      throw new Error('KkiaPay public key not configured')
    }
    
    const baseUrl = 'https://pay.kkiapay.me'
    const params = new URLSearchParams({
      api_key: this.publicKey,
      amount: options.amount,
      phone: options.phone || '',
      name: options.name || '',
      email: options.email || '',
      data: JSON.stringify(options.data || {})
    })
    
    return `${baseUrl}?${params.toString()}`
  }
}

// Instance singleton
const kkiapayService = new KkiapayService()

export default kkiapayService