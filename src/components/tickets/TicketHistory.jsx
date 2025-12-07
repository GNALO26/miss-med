import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, Search, Calendar, User, Ticket as TicketIcon,
  Mail, Phone, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react'
import { ticketsService } from '../../services/supabase/tickets'
import { formatCurrency } from '../../services/utils/constants'
import LoadingSpinner from '../common/LoadingSpinner'
import { toast } from 'react-hot-toast'

const TicketHistory = ({ userEmail }) => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState(userEmail || '')

  useEffect(() => {
    if (searchEmail) {
      loadTickets()
    }
  }, [searchEmail])

  const loadTickets = async () => {
    try {
      setLoading(true)
      
      const result = await ticketsService.getTicketsByEmail(searchEmail)
      
      if (result.success) {
        setTickets(result.data || [])
      } else {
        toast.error('Erreur lors du chargement des billets')
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTicket = async (ticket) => {
    try {
      if (ticket.pdf_url) {
        window.open(ticket.pdf_url, '_blank')
        toast.success('Téléchargement du billet...')
      } else {
        toast.error('PDF du billet non disponible')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement')
    }
  }

  const getTicketTypeName = (type) => {
    const types = {
      single: 'Billet 1 Personne',
      couple: 'Billet Couple',
      group: 'Billet Groupe (5 personnes)',
      vip: 'Billet VIP'
    }
    return types[type] || type
  }

  const getTicketTypeIcon = (type) => {
    const icons = {
      single: '👤',
      couple: '👥',
      group: '👨‍👩‍👧‍👦',
      vip: '👑'
    }
    return icons[type] || '🎫'
  }

  if (loading && !searchEmail) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <LoadingSpinner size="lg" message="Chargement de l'historique..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Rechercher mes billets
        </h3>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Entrez votre email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={loadTickets}
            disabled={!searchEmail || loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Search size={20} />
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <LoadingSpinner size="lg" message="Chargement des billets..." />
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Mes billets ({tickets.length})
            </h3>
            <button
              onClick={loadTickets}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl">
                        {getTicketTypeIcon(ticket.ticket_type)}
                      </div>
                      <div className="text-white">
                        <div className="font-bold">
                          {getTicketTypeName(ticket.ticket_type)}
                        </div>
                        <div className="text-white/80 text-sm">
                          Quantité: {ticket.quantity}
                        </div>
                      </div>
                    </div>
                    
                    {ticket.is_used ? (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Utilisé ✓
                      </div>
                    ) : (
                      <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Valide
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Prix */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Prix total</div>
                        <div className="text-2xl font-bold text-primary-600">
                          {formatCurrency(ticket.total_price)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Prix unitaire</div>
                        <div className="text-lg font-medium text-gray-900">
                          {formatCurrency(ticket.unit_price)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info acheteur */}
                  <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-700">{ticket.buyer_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail size={16} className="text-gray-500" />
                      <span className="text-gray-700">{ticket.buyer_email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-700">{ticket.buyer_phone}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <Calendar size={16} />
                    <span>
                      Acheté le {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* ID */}
                  <div className="mb-4 p-2 bg-gray-100 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">ID du billet</div>
                    <div className="font-mono text-sm font-bold text-gray-900">
                      {ticket.id.substring(0, 16).toUpperCase()}
                    </div>
                  </div>

                  {/* Statut paiement */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {ticket.payment_status === 'completed' ? (
                      <>
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-green-700 text-sm font-medium">
                          Paiement confirmé
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-yellow-500" />
                        <span className="text-yellow-700 text-sm font-medium">
                          En attente de confirmation
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleDownloadTicket(ticket)}
                    className="w-full py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Download size={20} />
                    <span>Télécharger le billet (PDF)</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : searchEmail ? (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <TicketIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Aucun billet trouvé
          </h3>
          <p className="text-gray-600">
            Aucun billet n'a été trouvé pour l'email <strong>{searchEmail}</strong>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Vérifiez que vous avez bien utilisé l'email avec lequel vous avez effectué l'achat
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <Search size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Recherchez vos billets
          </h3>
          <p className="text-gray-600">
            Entrez votre email pour retrouver tous vos billets achetés
          </p>
        </div>
      )}
    </div>
  )
}

export default TicketHistory