import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Globe, Shield, Users } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Voter', path: '/voting' },
    { name: 'Billetterie', path: '/tickets' },
    { name: 'À Propos', path: '/about' },
  ]

  const contactInfo = [
    { icon: <Mail size={18} />, text: 'contact@missfss.org', type: 'email', link: 'mailto:contact@missfss.org' },
    { icon: <Phone size={18} />, text: '+229 01 56 03 58 88', type: 'tel', link: 'tel:+2290156035888' },
    { icon: <MapPin size={18} />, text: 'Faculté des Sciences de Santé, Cotonou', type: 'address' },
  ]

  return (
    <footer className="bg-gradient-to-br from-primary-900 to-primary-800 text-white">
      {/* Top Section */}
      <div className="container-custom py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">MF</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Miss FSS</h3>
                <p className="text-white/80 text-sm">Édition 2026</p>
              </div>
            </div>
            <p className="text-white/70 mb-6">
              La plus prestigieuse élection étudiante de la Faculté des Sciences de Santé.
              Soutenez votre candidate préférée et rejoignez-nous pour la grande soirée de gala.
            </p>
            <div className="flex items-center space-x-2 text-secondary-300">
              <Shield size={18} />
              <span className="text-sm">Plateforme sécurisée</span>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>🔗</span>
              <span>Liens Rapides</span>
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-secondary-300 hover:pl-2 transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>📞</span>
              <span>Contact</span>
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="text-secondary-300 mt-0.5">{item.icon}</div>
                  {item.link ? (
                    <a 
                      href={item.link}
                      className="text-white/70 hover:text-secondary-300 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-white/70">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Crédits */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>🏆</span>
              <span>Crédits</span>
            </h4>
            
            {/* Organisateurs */}
            <div className="mb-6">
              <h5 className="font-semibold text-secondary-300 mb-3 flex items-center space-x-2">
                <Users size={16} />
                <span>Organisateur</span>
              </h5>
              <div className="bg-white/5 rounded-lg p-3 mb-2">
                <div className="font-medium text-white">AEMC</div>
                <div className="text-sm text-white/60">Organisateur Principal</div>
                <div className="text-xs text-white/50 mt-1">
                  Association des Étudiants en Médecine de Cotonou
                </div>
              </div>
            </div>

            {/* Développeur */}
            <div>
              <h5 className="font-semibold text-secondary-300 mb-3 flex items-center space-x-2">
                <Globe size={16} />
                <span>Développement</span>
              </h5>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="font-medium text-white">GUI-LOK Dev</div>
                <div className="text-sm text-white/60">Développeur Full Stack</div>
                <div className="text-xs text-white/50 mt-1">
                  Solution digitale professionnelle
                </div>
                <a
                  href="https://guilok.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-300 hover:text-secondary-200 text-xs mt-2 inline-flex items-center space-x-1"
                >
                  <Globe size={12} />
                  <span>Visiter le site</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} Miss FSS - Tous droits réservés. 
              <span className="mx-2">|</span>
              <span>Faculté des Sciences de Santé, Bénin</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white/50">
              <span className="text-sm">Made with</span>
              <Heart size={14} className="text-red-400" fill="currentColor" />
              <span className="text-sm">by</span>
              <a 
                href="https://guilok.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary-300 hover:text-secondary-200 transition-colors font-medium"
              >
                GUI-LOK Dev
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer