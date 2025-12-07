import React, { useState, useEffect } from 'react'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const Countdown = ({ targetDate = '2024-12-31T23:59:59', title = "Temps restant avant l'événement" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventPassed: false
  })

  const calculateTimeLeft = () => {
    const target = new Date(targetDate).getTime()
    const now = new Date().getTime()
    const difference = target - now

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEventPassed: true
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      isEventPassed: false
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days, color: 'from-primary-500 to-primary-600' },
    { label: 'Heures', value: timeLeft.hours, color: 'from-secondary-500 to-secondary-600' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'from-accent-500 to-accent-600' },
    { label: 'Secondes', value: timeLeft.seconds, color: 'from-purple-500 to-purple-600' },
  ]

  if (timeLeft.isEventPassed) {
    return (
      <div className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-center space-x-3">
          <AlertCircle className="text-white" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">L'événement est terminé</h3>
            <p className="text-white/90">Merci à tous pour votre participation !</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-primary-900 rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <Clock className="text-primary-300" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-white/70 text-sm">La soirée de gala approche</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-white/60">
          <Calendar size={18} />
          <span className="text-sm">
            {new Date(targetDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className={`bg-gradient-to-br ${unit.color} rounded-xl p-4 text-center shadow-lg overflow-hidden`}>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              
              {/* Value */}
              <motion.div
                key={unit.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl md:text-4xl font-bold text-white mb-1"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.div>
              
              {/* Label */}
              <div className="text-white/90 text-sm font-medium">{unit.label}</div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-lg"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Temps écoulé</span>
          <span>
            {Math.round(
              ((new Date().getTime() - new Date('2024-11-01').getTime()) /
                (new Date(targetDate).getTime() - new Date('2024-11-01').getTime())) *
                100
            )}
            %
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-secondary-500 to-accent-500"
            initial={{ width: '0%' }}
            animate={{
              width: `${Math.min(
                100,
                ((new Date().getTime() - new Date('2024-11-01').getTime()) /
                  (new Date(targetDate).getTime() - new Date('2024-11-01').getTime())) *
                  100
              )}%`
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-white/80 text-sm">
          <span className="font-semibold text-secondary-300">Dernière ligne droite !</span>
          <p className="mt-1">Ne manquez pas cette occasion unique de participer.</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/voting"
            className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Voter maintenant
          </a>
          <a
            href="/tickets"
            className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
          >
            Acheter un billet
          </a>
        </div>
      </div>
    </div>
  )
}

export default Countdown