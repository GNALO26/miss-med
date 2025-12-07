import React, { useState } from 'react'
import { CreditCard, User, Mail, Phone, Shield, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePayment } from '../../hooks/usePayment'
import { validateEmail, validatePhone } from '../../services/utils/constants'

const PaymentForm = ({ 
  ticketType, 
  quantity = 1,
  onSuccess,
  onCancel
}) => {
  const { purchaseTicket, isProcessing } = usePayment()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})

  const ticketPrices = {
    single: 12000,
    couple: 20000,
    group: 51000,
    vip: 15000
  }

  const ticketNames = {
    single: 'Billet 1 Personne',
    couple: 'Billet Couple',
    group: 'Billet Groupe (5 personnes)',
    vip: 'Billet VIP'
  }

  const unitPrice = ticketPrices[ticketType] || 0
  const totalPrice = unitPrice * quantity

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Adresse email invalide'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide. Format: +229 ou 0X XX XX XX XX'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const result = await purchaseTicket(
      ticketType,
      quantity,
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }
    )

    if (result.success && onSuccess) {
      onSuccess(result.ticket)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex items-center space-x-3">
          <CreditCard size={24} />
          <div>
            <h2 className="text-xl font-bold">Finaliser votre achat</h2>
            <p className="text-white/80 text-sm">
              {ticketNames[ticketType]} × {quantity}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Récapitulatif */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">{quantity} × {ticketNames[ticketType]}</span>
            <span className="font-medium">{unitPrice.toLocaleString()} FCFA</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary-600">
                {totalPrice.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="space-y-6">
          <div>
            <label className="label flex items-center space-x-2">
              <User size={16} />
              <span>Nom complet *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Votre nom et prénom"
              disabled={isProcessing}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <Mail size={16} />
              <span>Adresse email *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="exemple@email.com"
              disabled={isProcessing}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Vous recevrez votre billet PDF à cette adresse
            </p>
          </div>

          <div>
            <label className="label flex items-center space-x-2">
              <Phone size={16} />
              <span>Numéro de téléphone *</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`input ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+229 XX XX XX XX"
              disabled={isProcessing}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Conditions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                disabled={isProcessing}
                className="mt-1"
                id="acceptTerms"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                J'accepte les{' '}
                <a href="/terms" className="text-primary-600 hover:underline">
                  conditions générales
                </a>
                {' '}et la{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">
                  politique de confidentialité
                </a>
                . Je comprends que mon billet est strictement personnel et non transférable.
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Avertissement */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important</p>
                <p className="mt-1">
                  Après paiement, votre billet PDF sera généré automatiquement. 
                  Présentez-le à l'entrée de l'événement. Aucun remboursement ne sera possible après l'achat.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>
                    Payer {totalPrice.toLocaleString()} FCFA
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Sécurité */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Shield size={16} className="text-green-500" />
            <span>Paiement 100% sécurisé</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div>Cryptage SSL</div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div>Garantie de remboursement 24h</div>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentForm