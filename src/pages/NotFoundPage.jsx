import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, Compass } from 'lucide-react'

const NotFoundPage = () => {
  const suggestions = [
    { path: '/', label: 'Page d\'accueil', icon: '🏠' },
    { path: '/voting', label: 'Voter pour une candidate', icon: '🗳️' },
    { path: '/tickets', label: 'Acheter un billet', icon: '🎫' },
    { path: '/about', label: 'À propos de l\'événement', icon: '📖' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 p-8 md:p-12 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="text-9xl font-bold mb-4">404</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Page non trouvée
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Oups ! Il semble que la page que vous cherchez ait pris des vacances.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Suggestions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Compass size={24} className="text-primary-600" />
                  <span>Suggestions</span>
                </h2>
                
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <Link
                      key={index}
                      to={suggestion.path}
                      className="block group"
                    >
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                            {suggestion.label}
                          </div>
                        </div>
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-primary-600 rotate-180 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Message d'erreur */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Search size={24} className="text-primary-600" />
                  <span>Que faire maintenant ?</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                    <h3 className="font-bold text-gray-900 mb-2">Retourner à l'accueil</h3>
                    <p className="text-gray-700 mb-4">
                      La solution la plus simple est de retourner à la page d'accueil et de naviguer depuis là.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Home size={18} />
                      <span>Retour à l'accueil</span>
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
                    <h3 className="font-bold text-gray-900 mb-2">Signaler un problème</h3>
                    <p className="text-gray-700 mb-4">
                      Si vous pensez qu'il s'agit d'une erreur, contactez-nous pour que nous puissions régler le problème.
                    </p>
                    <a
                      href="mailto:contact@missfss.org"
                      className="inline-flex items-center space-x-2 px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    >
                      <span>✉️</span>
                      <span>Nous contacter</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Rechercher sur le site
                </h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher une candidate, billet, information..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div>
                <p>© {new Date().getFullYear()} Miss FSS • Tous droits réservés</p>
              </div>
              <div className="mt-4 md:mt-0">
                <p>Code d'erreur: 404 • Page introuvable</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage