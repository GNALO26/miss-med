import React, { useState } from 'react'
import Modal from '../common/Modal'
import { Vote, User, Mail, Phone, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import kkiapayService from '../../services/payment/kkiapay'
import { votesService } from '../../services/supabase/votes'
import { toast } from 'react-hot-toast'

const VotingModal = ({ isOpen, onClose, candidate, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    voteCount: 1
  })

  const votePrice = 100
  const totalAmount = votePrice * formData.voteCount

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('L\'email est requis')
      return false
    }
    if (!formData.phone.trim()) {
      toast.error('Le téléphone est requis')
      return false
    }
    return true
  }

  const handleVoteSubmit = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // 1. Effectuer le paiement via KkiaPay
      const paymentResult = await kkiapayService.processVotePayment(
        candidate.id,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        totalAmount
      )

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Paiement échoué')
      }

      // 2. Enregistrer le vote dans la base de données
      const voteResult = await votesService.recordVote({
        candidateId: candidate.id,
        voterInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        amount: totalAmount,
        transactionId: paymentResult.transactionId
      })

      if (!voteResult.success) {
        throw new Error('Erreur lors de l\'enregistrement du vote')
      }

      // 3. Succès
      toast.success(`Merci pour vos ${formData.voteCount} vote(s) !`)
      setStep(3)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Voting error:', error)
      toast.error(error.message || 'Une erreur est survenue lors du vote')
      setStep(4) // Étape d'erreur
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Candidate Info */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            #{candidate.candidate_number}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{candidate.name}</h3>
            <p className="text-gray-600">Vous votez pour cette candidate</p>
          </div>
        </div>
      </div>

      {/* Vote Count */}
      <div>
        <label className="label">Nombre de votes</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFormData(prev => ({
              ...prev,
              voteCount: Math.max(1, prev.voteCount - 1)
            }))}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            disabled={formData.voteCount <= 1}
          >
            <span className="text-xl">-</span>
          </button>
          
          <div className="flex-1 text-center">
            <div className="text-4xl font-bold text-primary-600">{formData.voteCount}</div>
            <div className="text-gray-600">vote(s)</div>
          </div>
          
          <button
            onClick={() => setFormData(prev => ({
              ...prev,
              voteCount: prev.voteCount + 1
            }))}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Prix par vote</span>
          <span className="font-medium">100 FCFA</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            {totalAmount.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={() => setStep(2)}
        className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
      >
        Continuer vers le paiement
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-blue-500 mt-0.5" size={20} />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Information importante</p>
            <p className="mt-1">Vos informations sont nécessaires pour la confirmation du vote. Elles ne seront pas partagées publiquement.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
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
            className="input"
            placeholder="Votre nom et prénom"
            required
          />
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
            className="input"
            placeholder="exemple@email.com"
            required
          />
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
            className="input"
            placeholder="+229 XX XX XX XX"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Format: +229 ou 0X XX XX XX XX</p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">{formData.voteCount} vote(s) × 100 FCFA</span>
          <span className="font-medium">{(formData.voteCount * 100).toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-lg font-bold">Total à payer</span>
          <span className="text-2xl font-bold text-primary-600">
            {totalAmount.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isProcessing}
        >
          Retour
        </button>
        <button
          onClick={handleVoteSubmit}
          disabled={isProcessing}
          className="flex-1 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Traitement...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Payer {totalAmount.toLocaleString()} FCFA</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Vote confirmé !
      </h3>
      
      <p className="text-gray-600 mb-6">
        Merci pour vos {formData.voteCount} vote(s) en faveur de <span className="font-bold">{candidate.name}</span>.
        Votre soutien a été enregistré avec succès.
      </p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Candidate</div>
            <div className="font-bold text-lg">{candidate.name}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Total payé</div>
            <div className="font-bold text-lg text-primary-600">
              {totalAmount.toLocaleString()} FCFA
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          Retour au classement
        </button>
        <button
          onClick={() => {
            setStep(1)
            setFormData({
              name: '',
              email: '',
              phone: '',
              voteCount: 1
            })
          }}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voter pour une autre candidate
        </button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={48} className="text-red-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Paiement échoué
      </h3>
      
      <p className="text-gray-600 mb-6">
        Une erreur est survenue lors du traitement de votre paiement.
        Veuillez réessayer ou contacter le support si le problème persiste.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => setStep(2)}
          className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          Réessayer le paiement
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  )

  const stepTitles = [
    'Nombre de votes',
    'Informations de paiement',
    'Confirmation',
    'Erreur'
  ]

  const stepIcons = ['🔢', '💳', '✅', '❌']

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Vote className="text-primary-600" size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-900">{stepTitles[step - 1]}</div>
            <div className="text-sm text-gray-500">Étape {step} sur 4</div>
          </div>
        </div>
      }
      size="md"
      showCloseButton={!isProcessing}
      closeOnOverlayClick={!isProcessing}
    >
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${
                stepNumber <= step ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                stepNumber < step 
                  ? 'bg-green-100 text-green-600'
                  : stepNumber === step
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {stepIcons[stepNumber - 1]}
              </div>
              <span className="text-xs">Étape {stepNumber}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </Modal>
  )
}

export default VotingModal