import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Download, Home, Ticket, Share2, Printer } from 'lucide-react'
import { motion } from 'framer-motion'

const SuccessPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  
  const transactionType = queryParams.get('type') || 'ticket'
  const transactionId = queryParams.get('id') || 'TRX-123456'
  const amount = queryParams.get('amount') || '0'
  const candidateName = queryParams.get('candidate') || 'Candidate'

  const isVote = transactionType === 'vote'
  const title = isVote ? 'Vote confirmé !' : 'Billet acheté avec succès !'
  
  const getMessage = () => {
    if (isVote) {
      return `Merci pour votre vote en faveur de ${candidateName}. Votre soutien a été enregistré avec succès.`
    }
    return `Votre billet pour la soirée Miss FSS a été réservé avec succès. Votre PDF est prêt à être téléchargé.`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isVote ? 'Je viens de voter pour Miss FSS !' : 'Je viens d\'acheter mon billet pour Miss FSS !',
        text: isVote 
          ? `Je viens de voter pour ${candidateName} à l'élection Miss FSS 2024. Rejoignez-moi !`
          : 'Je viens d\'acheter mon billet pour la soirée de gala Miss FSS 2024. Ça va être incroyable !',
        url: window.location.origin
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-white/90">
              {getMessage()}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Détails de la transaction */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">Détails de la transaction</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium">
                    {isVote ? 'Vote' : 'Achat de billet'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ID Transaction</div>
                  <div className="font-mono font-medium">{transactionId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Montant</div>
                  <div className="font-bold text-green-600">
                    {parseInt(amount).toLocaleString()} FCFA
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">
                    {new Date().toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {!isVote && (
                <button
                  onClick={() => {}}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Download size={20} />
                  <span>Télécharger le billet PDF</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Share2 size={20} />
                <span>Partager sur les réseaux</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Printer size={20} />
                <span>Imprimer la confirmation</span>
              </button>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Prochaines étapes</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  {isVote ? (
                    <>
                      <li>✓ Votre vote a été comptabilisé dans les résultats</li>
                      <li>✓ Suivez le classement en temps réel sur la page des votes</li>
                      <li>✓ Partagez avec vos amis pour soutenir votre candidate</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Téléchargez votre billet PDF ci-dessus</li>
                      <li>✓ Présentez le billet à l'entrée le jour de l'événement</li>
                      <li>✓ Arrivez 30 minutes avant le début de la cérémonie</li>
                      <li>✓ Ayez une pièce d'identité avec vous</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>Retour à l'accueil</span>
              </Link>
              
              <Link
                to={isVote ? "/voting" : "/tickets"}
                className="flex-1 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all flex items-center justify-center space-x-2"
              >
                <Ticket size={20} />
                <span>{isVote ? 'Voir le classement' : 'Acheter un autre billet'}</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SuccessPage