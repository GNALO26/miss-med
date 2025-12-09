import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Trophy, Calendar, MapPin, Heart, 
  Star, Target, Award, Globe, Mail, Phone 
} from 'lucide-react'

const AboutPage = () => {
  const organizers = [
    {
      name: 'AEMC',
      role: 'Organisateur Principal',
      description: 'Association des Étudiants en Médecine de Cotonou',
      logo: '/logos/aemc-logo.png'
    }
  ]

  const developers = [
    {
      name: 'GUI-LOK Dev',
      role: 'Développeur Full Stack',
      description: 'Expert en solutions digitales sur mesure',
      photo: '/logos/guilok-photo.jpg',
      website: 'https://guilok.dev',
      email: 'contact@guilok.dev',
      phone: '+229 01 56 03 58 88'
    }
  ]

  const eventDetails = [
    {
      icon: <Calendar className="text-primary-600" size={24} />,
      title: 'Date',
      content: '24 Janvier 2026',
      description: 'À partir de 18h00'
    },
    {
      icon: <MapPin className="text-secondary-600" size={24} />,
      title: 'Lieu',
      content: 'Faculté des Sciences de Santé',
      description: 'Cotonou, Bénin'
    },
    {
      icon: <Trophy className="text-accent-600" size={24} />,
      title: 'Édition',
      content: 'Miss FSS 2026',
      description: '10ème édition'
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: 'Participants',
      content: '500+ attendus',
      description: 'Étudiants, invités spéciaux'
    }
  ]

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        <div className="container-custom relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star size={16} className="text-secondary-300" />
              <span className="text-sm font-medium">À Propos</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Miss FSS 2026
              <span className="block text-secondary-300">L'Événement Étudiant de l'Année</span>
            </h1>

            <p className="text-xl text-white/80 mb-8">
              Découvrez l'histoire derrière la plus prestigieuse élection étudiante 
              de la Faculté des Sciences de Santé. Une célébration du talent, 
              de l'intelligence et de la beauté.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Event Details */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center"
              >
                <div className="inline-flex p-3 bg-gray-100 rounded-xl mb-4">
                  {detail.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{detail.title}</h3>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {detail.content}
                </div>
                <p className="text-gray-600 text-sm">{detail.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Notre Histoire
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
            </div>

            <div className="prose prose-lg mx-auto">
              <p className="text-gray-700 mb-6">
                <span className="font-bold text-primary-600">Miss FSS</span> est bien plus qu'un simple concours de beauté. 
                C'est une tradition annuelle qui célèbre l'excellence académique, 
                le leadership et l'engagement communautaire des étudiantes de la 
                Faculté des Sciences de Santé.
              </p>

              <p className="text-gray-700 mb-6">
                Depuis sa première édition en 2015, Miss FSS est devenu l'événement 
                étudiant le plus attendu de l'année. Ce concours met en lumière 
                des jeunes femmes exceptionnelles qui excellent non seulement dans 
                leurs études médicales, mais qui sont également engagées dans des 
                causes sociales et humanitaires.
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 my-8 border-l-4 border-primary-500">
                <div className="flex items-start space-x-3">
                  <Target className="text-primary-600 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Notre Mission</h3>
                    <p className="text-gray-700">
                      Promouvoir l'excellence académique, renforcer la solidarité étudiante, 
                      et mettre en valeur le talent et le leadership des futures 
                      professionnelles de la santé.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700">
                Chaque édition est l'occasion de récolter des fonds pour des causes 
                caritatives, de renforcer les liens entre étudiants, et de créer 
                des souvenirs inoubliables. Miss FSS 2024 promet d'être la plus 
                grande édition jamais organisée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organisateurs */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Les Organisateurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les équipes dévouées qui travaillent sans relâche pour 
              faire de Miss FSS 2026 un succès retentissant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {organizers.map((organizer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                  <h3 className="text-2xl font-bold">{organizer.name}</h3>
                  <p className="text-white/80">{organizer.role}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {organizer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{organizer.name}</h4>
                      <p className="text-gray-600">{organizer.description}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    L'Association des Étudiants en Médecine de Cotonou (AEMC) est 
                    l'organisation étudiante leader de la faculté. Avec plus de 
                    10 ans d'expérience dans l'organisation d'événements majeurs, 
                    l'AEMC s'engage à offrir aux étudiants des expériences 
                    mémorables et formatrices.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Développeur */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-primary-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Le Développeur
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              La plateforme digitale qui rend cet événement possible
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {developers.map((developer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Photo du développeur */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center">
                        <Globe size={64} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="flex-1">
                    <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                      <Award size={16} />
                      <span className="text-sm font-medium">Expert en solutions digitales</span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{developer.name}</h3>
                    <p className="text-white/80 mb-4">{developer.role}</p>
                    
                    <p className="text-white/90 mb-6">
                      {developer.description} spécialisé dans la création de 
                      plateformes web modernes, performantes et sécurisées. 
                      Cette plateforme de vote et de billetterie a été conçue 
                      pour offrir une expérience utilisateur exceptionnelle.
                    </p>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {developer.website && (
                        <a
                          href={developer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
                        >
                          <Globe size={18} />
                          <span>{developer.website}</span>
                        </a>
                      )}
                      
                      {developer.email && (
                        <a
                          href={`mailto:${developer.email}`}
                          className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
                        >
                          <Mail size={18} />
                          <span>{developer.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technologies utilisées */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <h4 className="font-bold mb-4 text-lg">Technologies utilisées</h4>
                  <div className="flex flex-wrap gap-3">
                    {['React', 'Node.js', 'Supabase', 'Tailwind CSS', 'KkiaPay', 'Netlify'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à participer à cette aventure ?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines d'étudiants et de passionnés pour célébrer 
              l'excellence et la beauté au service de la santé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/voting"
                className="px-8 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Voter maintenant
              </a>
              <a
                href="/tickets"
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                Acheter un billet
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage