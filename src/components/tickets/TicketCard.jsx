import React from 'react'
import { motion } from 'framer-motion'
import { Check, Users, Crown, User, Star, Shield, Gift, Camera } from 'lucide-react'

const TicketCard = ({ 
  ticketType, 
  isSelected, 
  onSelect,
  showFeatures = true 
}) => {
  const ticketTypes = {
    single: {
      name: 'Billet 1 Personne',
      price: 12000,
      capacity: 1,
      description: 'Accès standard pour 1 personne',
      features: [
        'Accès à la soirée',
        'Place assise standard',
        'Cadeau de bienvenue',
        'Rafraîchissements',
        'Souvenir photo'
      ],
      icon: <User className="text-blue-600" size={24} />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      badge: 'Populaire'
    },
    couple: {
      name: 'Billet Couple',
      price: 20000,
      capacity: 2,
      description: 'Accès pour 2 personnes',
      features: [
        'Accès pour 2 personnes',
        'Places côte à côte',
        'Cadeaux de bienvenue',
        'Rafraîchissements premium',
        'Photo couple souvenir'
      ],
      icon: <Users className="text-green-600" size={24} />,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      badge: 'Économique'
    },
    group: {
      name: 'Billet Groupe (5 personnes)',
      price: 51000,
      capacity: 5,
      description: 'Accès pour un groupe de 5 personnes',
      features: [
        'Accès pour 5 personnes',
        'Table réservée',
        'Service dédié',
        'Cadeaux spéciaux',
        'Photo de groupe officielle'
      ],
      icon: <Users className="text-purple-600" size={24} />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      badge: 'Meilleure offre'
    },
    vip: {
      name: 'Billet VIP',
      price: 15000,
      capacity: 1,
      description: 'Accès VIP avec avantages exclusifs',
      features: [
        'Accès VIP',
        'Place en avant',
        'Rencontre avec les candidates',
        'Cadeau VIP exclusif',
        'Buffet premium',
        'Photo souvenir avec gagnante'
      ],
      icon: <Crown className="text-yellow-600" size={24} />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      badge: 'VIP'
    }
  }

  const ticket = ticketTypes[ticketType] || ticketTypes.single

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative rounded-2xl border-2 ${ticket.borderColor} overflow-hidden transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      }`}
    >
      {/* Badge */}
      {ticket.badge && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-3 py-1 bg-gradient-to-r ${ticket.color} text-white text-xs font-bold rounded-full shadow-lg`}>
            {ticket.badge}
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-br ${ticket.bgColor} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            {ticket.icon}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {ticket.price.toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-600">pour {ticket.capacity} personne(s)</div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {ticket.name}
        </h3>
        <p className="text-gray-600">
          {ticket.description}
        </p>
      </div>

      {/* Features */}
      {showFeatures && (
        <div className="p-6 bg-white">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Star size={18} className="text-secondary-500" />
            <span>Ce billet inclus :</span>
          </h4>
          <ul className="space-y-3">
            {ticket.features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Avantage supplémentaire pour VIP */}
          {ticketType === 'vip' && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Crown size={16} />
                <span className="text-sm font-medium">Expérience VIP exclusive</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-green-500" />
              <span>Garantie 24h</span>
            </div>
          </div>
          
          <button
            onClick={() => onSelect(ticketType)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isSelected
                ? `bg-gradient-to-r ${ticket.color} text-white shadow-lg`
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isSelected ? 'Sélectionné' : 'Sélectionner'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Composant pour l'affichage en grille
export const TicketGrid = ({ selectedType, onSelect }) => {
  const types = ['single', 'couple', 'group', 'vip']

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {types.map((type) => (
        <TicketCard
          key={type}
          ticketType={type}
          isSelected={selectedType === type}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default TicketCard