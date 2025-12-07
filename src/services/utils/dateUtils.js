/**
 * Utilitaires pour la gestion des dates
 */

// Formater une date en français
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Date(date).toLocaleDateString('fr-FR', defaultOptions)
}

// Formater une date avec l'heure
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formater uniquement l'heure
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formater une date courte (JJ/MM/AAAA)
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Obtenir le nombre de jours entre deux dates
export const getDaysBetween = (date1, date2) => {
  const diff = Math.abs(new Date(date2) - new Date(date1))
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Obtenir le nombre d'heures entre deux dates
export const getHoursBetween = (date1, date2) => {
  const diff = Math.abs(new Date(date2) - new Date(date1))
  return Math.ceil(diff / (1000 * 60 * 60))
}

// Vérifier si une date est passée
export const isPast = (date) => {
  return new Date(date) < new Date()
}

// Vérifier si une date est future
export const isFuture = (date) => {
  return new Date(date) > new Date()
}

// Vérifier si une date est aujourd'hui
export const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  
  return checkDate.getDate() === today.getDate() &&
         checkDate.getMonth() === today.getMonth() &&
         checkDate.getFullYear() === today.getFullYear()
}

// Obtenir le temps relatif (il y a X heures, etc.)
export const getRelativeTime = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) {
    return 'À l\'instant'
  } else if (diffMins < 60) {
    return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
  } else if (diffDays < 30) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  } else if (diffMonths < 12) {
    return `Il y a ${diffMonths} mois`
  } else {
    return `Il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`
  }
}

// Formater une durée (en secondes) en format lisible
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(' ')
}

// Ajouter des jours à une date
export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Soustraire des jours à une date
export const subtractDays = (date, days) => {
  return addDays(date, -days)
}

// Ajouter des heures à une date
export const addHours = (date, hours) => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

// Obtenir le début de la journée
export const startOfDay = (date) => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

// Obtenir la fin de la journée
export const endOfDay = (date) => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

// Obtenir le début de la semaine
export const startOfWeek = (date) => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1) // Lundi comme premier jour
  result.setDate(diff)
  result.setHours(0, 0, 0, 0)
  return result
}

// Obtenir la fin de la semaine
export const endOfWeek = (date) => {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  result.setHours(23, 59, 59, 999)
  return result
}

// Obtenir le début du mois
export const startOfMonth = (date) => {
  const result = new Date(date)
  result.setDate(1)
  result.setHours(0, 0, 0, 0)
  return result
}

// Obtenir la fin du mois
export const endOfMonth = (date) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1, 0)
  result.setHours(23, 59, 59, 999)
  return result
}

// Obtenir le nombre de jours dans un mois
export const getDaysInMonth = (date) => {
  const result = new Date(date)
  return new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()
}

// Formater une date pour l'input datetime-local
export const formatForInput = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Parser une date ISO
export const parseISO = (dateString) => {
  return new Date(dateString)
}

// Vérifier si une date est valide
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date)
}

// Obtenir le nom du jour
export const getDayName = (date, short = false) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: short ? 'short' : 'long'
  })
}

// Obtenir le nom du mois
export const getMonthName = (date, short = false) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    month: short ? 'short' : 'long'
  })
}

// Obtenir le temps restant jusqu'à une date (pour compte à rebours)
export const getTimeRemaining = (targetDate) => {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    }
  }

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false
  }
}

// Formater le temps restant en texte
export const formatTimeRemaining = (targetDate) => {
  const remaining = getTimeRemaining(targetDate)
  
  if (remaining.isExpired) {
    return 'Événement terminé'
  }

  const parts = []
  if (remaining.days > 0) parts.push(`${remaining.days} jour${remaining.days > 1 ? 's' : ''}`)
  if (remaining.hours > 0) parts.push(`${remaining.hours} heure${remaining.hours > 1 ? 's' : ''}`)
  if (remaining.minutes > 0) parts.push(`${remaining.minutes} minute${remaining.minutes > 1 ? 's' : ''}`)
  
  return parts.join(', ') || 'Moins d\'une minute'
}

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatDateShort,
  getDaysBetween,
  getHoursBetween,
  isPast,
  isFuture,
  isToday,
  getRelativeTime,
  formatDuration,
  addDays,
  subtractDays,
  addHours,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  formatForInput,
  parseISO,
  isValidDate,
  getDayName,
  getMonthName,
  getTimeRemaining,
  formatTimeRemaining
}