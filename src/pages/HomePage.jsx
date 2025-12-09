import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Vote, Ticket, Users, Trophy, Star, TrendingUp, 
  Calendar, MapPin, ArrowRight, Shield, CheckCircle 
} from 'lucide-react'

// Composants
import Countdown from '../components/common/Countdown'
import CandidateCard from '../components/voting/CandidateCard'
import { useVoting } from '../contexts/VotingContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const HomePage = () => {
  const { candidates, loading, getTopCandidates } = useVoting()

  const topCandidates = getTopCandidates(3)
  const eventEndDate = import.meta.env.VITE_EVENT_END_DATE || '2026-01-23T23:59:59'
const ceremonyDate = import.meta.env.VITE_EVENT_CEREMONY_DATE || '2026-01-24T18:00:00'

  const features = [
    {
      icon: <Vote className="text-primary-600" size={24} />,
      title: 'Vote Sécurisé',
      description: 'Système de vote transparent et sécurisé avec KkiaPay',
      color: 'from-primary-50 to-primary-100'
    },
    {
      icon: <Ticket className="text-secondary-600" size={24} />,
      title: 'Billetterie En Ligne',
      description: 'Achetez vos billets pour la soirée de gala en quelques clics',
      color: 'from-secondary-50 to-secondary-100'
    },
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: 'Paiement Sécurisé',
      description: 'Transactions 100% sécurisées avec cryptage SSL',
      color: 'from-green-50 to-green-100'
    },
    {
      icon: <Trophy className="text-accent-600" size={24} />,
      title: 'Classement en Direct',
      description: 'Suivez les résultats en temps réel',
      color: 'from-accent-50 to-accent-100'
    }
  ]

  const stats = [
    { label: 'Candidates', value: '10', icon: '👑' },
    { label: 'Votes Total', value: '2,540', icon: '🗳️' },
    { label: 'Montant Collecté', value: '254,000', suffix: 'FCFA', icon: '💰' },
    { label: 'Jours Restants', value: '45', icon: '⏳' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" message="Chargement de la page d'accueil..." />
      </div>
    )
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container-custom relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star size={16} className="text-secondary-300" />
                <span className="text-sm font-medium">Édition 2026</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Miss FSS
                <span className="block text-secondary-300">L'Élection Prestigieuse</span>
              </h1>

              <p className="text-xl text-white/80 mb-8">
                Participez à l'élection la plus attendue de la Faculté des Sciences de Santé.
                Votez pour votre candidate préférée et rejoignez-nous pour la grande soirée de gala.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-secondary-300" size={20} />
                  <span>31 Décembre 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-secondary-300" size={20} />
                  <span>Faculté des Sciences de Santé</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/voting"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl group"
                >
                  <Vote size={20} />
                  <span>Voter Maintenant</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/tickets"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  <Ticket size={20} />
                  <span>Acheter un Billet</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Countdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
             <Countdown 
              targetDate={eventEndDate}
              title="Temps restant avant la fin des votes"
            />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Une expérience de vote moderne, sécurisée et transparente conçue pour vous offrir le meilleur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="mb-4 p-3 bg-white rounded-xl inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Candidates Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Les Candidates en Tête
              </h2>
              <p className="text-gray-600">
                Découvrez les candidates qui font sensation cette année
              </p>
            </div>
            <Link
              to="/voting"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>Voir toutes les candidates</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          {topCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topCandidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  index={index}
                  showVotes={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Aucune candidate pour le moment
              </h3>
              <p className="text-gray-600">
                Les candidates seront bientôt annoncées
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container-custom py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                  {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-white/80">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ne manquez pas cet événement exceptionnel !
                  </h2>
                  <p className="text-white/90 mb-6 text-lg">
                    Rejoignez des centaines de participants pour une soirée inoubliable.
                    Achetez vos billets maintenant et assurez-vous une place pour cette édition historique.
                  </p>
                  <div className="flex items-center space-x-2 text-white/80">
                    <CheckCircle size={20} />
                    <span>Garantie de remboursement sous 24h</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/tickets"
                    className="flex-1 bg-white text-secondary-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors text-center shadow-lg hover:shadow-xl"
                  >
                    Acheter un billet
                  </Link>
                  <Link
                    to="/about"
                    className="flex-1 bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors text-center border border-white/30"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage