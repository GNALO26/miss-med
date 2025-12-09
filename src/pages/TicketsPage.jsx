import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Ticket, ShoppingCart, Users, Shield, Download, 
  QrCode, Calendar, MapPin, ArrowRight, CheckCircle 
} from 'lucide-react'

// Composants
import { TicketGrid } from '../components/tickets/TicketCard'
import PaymentForm from '../components/tickets/PaymentForm'
import Modal from '../components/common/Modal'
import { ContentLoader } from '../components/common/LoadingSpinner'

const TicketsPage = () => {
  const [selectedType, setSelectedType] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedTicket, setPurchasedTicket] = useState(null)

  const ticketTypes = {
    single: { name: 'Billet 1 Personne', price: 12000 },
    couple: { name: 'Billet Couple', price: 20000 },
    group: { name: 'Billet Groupe (5 personnes)', price: 51000 },
    vip: { name: 'Billet VIP', price: 15000 }
  }

  const handleSelectTicket = (type) => {
    setSelectedType(type)
    setQuantity(1)
  }

  const handlePurchaseSuccess = (ticket) => {
    setPurchasedTicket(ticket)
    setShowPayment(false)
    setShowSuccessModal(true)
    setSelectedType(null)
  }

  const renderSuccessModal = () => (
    <Modal
      isOpen={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      title="Achat réussi !"
      size="md"
    >
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Félicitations !
        </h3>
        
        <p className="text-gray-600 mb-6">
          Votre billet a été acheté avec succès. 
          Le PDF de votre billet a été généré et est prêt à être téléchargé.
        </p>

        {purchasedTicket && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-sm text-gray-500">Type de billet</div>
                <div className="font-bold">
                  {ticketTypes[purchasedTicket.ticket_type]?.name || purchasedTicket.ticket_type}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Prix total</div>
                <div className="font-bold text-primary-600">
                  {purchasedTicket.total_price?.toLocaleString()} FCFA
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Quantité</div>
                <div className="font-bold">{purchasedTicket.quantity}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">ID du billet</div>
                <div className="font-mono text-sm">
                  {purchasedTicket.id?.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => {
              if (purchasedTicket?.pdf_url) {
                window.open(purchasedTicket.pdf_url, '_blank')
              }
            }}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>Télécharger mon billet (PDF)</span>
          </button>
          
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retour à la billetterie
          </button>
        </div>
      </div>
    </Modal>
  )

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container-custom py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Billetterie Miss FSS 2026
              </h1>
              <p className="text-xl text-white/80 mb-6">
                Réservez votre place pour la soirée de gala la plus attendue de l'année.
                Choisissez parmi nos formules exclusives.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-secondary-300" size={20} />
                  <span>24 Janvier 2026 • 19h00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-secondary-300" size={20} />
                  <span>Faculté des Sciences de Santé, Cotonou</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">🎫</div>
                <div className="text-lg font-bold">Billets disponibles</div>
                <div className="text-3xl font-bold mt-2">4 types</div>
                <div className="text-white/80 text-sm mt-1">pour tous les budgets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process d'achat */}
      <div className="container-custom py-8 px-4 sm:px-6 lg:px-8">
        {/* Étapes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Achetez votre billet en 3 étapes simples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: 'Choisissez votre billet',
                description: 'Sélectionnez le type de billet qui correspond à vos besoins',
                icon: '🎯'
              },
              {
                step: 2,
                title: 'Remplissez vos informations',
                description: 'Entrez vos coordonnées pour la génération du billet',
                icon: '📝'
              },
              {
                step: 3,
                title: 'Paiement sécurisé',
                description: 'Effectuez le paiement via KkiaPay et recevez votre billet',
                icon: '💳'
              }
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.step * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sélection des billets */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Nos formules de billets
            </h2>
            {selectedType && (
              <button
                onClick={() => setSelectedType(null)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir tous les billets
              </button>
            )}
          </div>

          <TicketGrid 
            selectedType={selectedType}
            onSelect={handleSelectTicket}
          />
        </div>

        {/* Quantité sélecteur */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-6 border border-secondary-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {ticketTypes[selectedType]?.name}
                  </h3>
                  <p className="text-gray-600">
                    Sélectionnez la quantité de billets souhaitée
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <span className="text-xl">-</span>
                    </button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">{quantity}</div>
                      <div className="text-gray-600 text-sm">billet(s)</div>
                    </div>
                    
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {(ticketTypes[selectedType]?.price * quantity).toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowPayment(true)}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Procéder au paiement</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Informations importantes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900">Paiement sécurisé</h3>
            </div>
            <p className="text-gray-600">
              Toutes les transactions sont cryptées avec SSL. Vos informations bancaires sont protégées.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900">Billet numérique</h3>
            </div>
            <p className="text-gray-600">
              Recevez instantanément votre billet PDF après paiement. Présentez-le sur votre smartphone.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <QrCode className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900">Accès rapide</h3>
            </div>
            <p className="text-gray-600">
              Un code QR unique sur chaque billet pour un scan rapide à l'entrée de l'événement.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de paiement */}
      <Modal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        title="Finalisation de l'achat"
        size="lg"
      >
        <PaymentForm
          ticketType={selectedType}
          quantity={quantity}
          onSuccess={handlePurchaseSuccess}
          onCancel={() => setShowPayment(false)}
        />
      </Modal>

      {/* Modal de succès */}
      {renderSuccessModal()}
    </div>
  )
}

export default TicketsPage