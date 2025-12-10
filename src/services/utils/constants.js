// Constantes de l'application
export const APP_CONSTANTS = {
  // Application
  APP_NAME: 'Miss FSS Voting Platform',
  APP_VERSION: '1.0.0',
  
  // Événement
  EVENT_NAME: 'Miss FSS 2026',
  EVENT_ORGANIZER: 'AEMC - Association des Étudiants en Médecine de Cotonou',
  EVENT_LOCATION: 'Faculté des Sciences de Santé',
  EVENT_CITY: 'Cotonou, Bénin',
  
  // Développeur
  DEVELOPER_NAME: 'GUI-LOK Dev',
  DEVELOPER_EMAIL: 'olympeguidolokossou@gmail.com',
  DEVELOPER_WEBSITE: 'https://guilok.dev',
  
  // Prix
  VOTE_PRICE: 100, // FCFA
  TICKET_PRICES: {
    SINGLE: 12000,
    COUPLE: 20000,
    GROUP: 51000,
    VIP: 15000
  },
  
  // Dates
  EVENT_START_DATE: '2025-12-15T00:00:00',
  EVENT_END_DATE: '2026-01-23T23:59:59',
  EVENT_CEREMONY_DATE: '2026-01-24T18:00:00',
  VOTING_START_DATE: '2025-12-15T00:00:00',
  VOTING_END_DATE: '2026-01-23T23:59:59',
  
  // Configuration
  MAX_VOTES_PER_TRANSACTION: 100,
  MAX_TICKETS_PER_TRANSACTION: 10,
  RESULTS_VISIBILITY_DAYS_BEFORE_END: 14,
  
  // URLs
  TERMS_URL: '/terms',
  PRIVACY_URL: '/privacy',
  CONTACT_URL: '/contact',
  
  // Social Media
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/missfss',
    INSTAGRAM: 'https://instagram.com/missfss',
    TWITTER: 'https://twitter.com/missfss',
    WHATSAPP: 'https://wa.me/22901560358'
  }
}

// Messages d'erreur
export const ERROR_MESSAGES = {
  // Général
  NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre internet.',
  SERVER_ERROR: 'Erreur du serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Accès non autorisé. Veuillez vous connecter.',
  FORBIDDEN: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.',
  
  // Paiement
  PAYMENT_FAILED: 'Le paiement a échoué. Veuillez réessayer.',
  PAYMENT_TIMEOUT: 'Le paiement a expiré. Veuillez réessayer.',
  PAYMENT_CANCELLED: 'Le paiement a été annulé.',
  PAYMENT_VERIFICATION_FAILED: 'Impossible de vérifier le paiement.',
  
  // Formulaire
  REQUIRED_FIELD: 'Ce champ est obligatoire.',
  INVALID_EMAIL: 'Adresse email invalide.',
  INVALID_PHONE: 'Numéro de téléphone invalide.',
  INVALID_AMOUNT: 'Montant invalide.',
  
  // Votes
  VOTE_LIMIT_EXCEEDED: 'Limite de votes dépassée.',
  CANDIDATE_NOT_FOUND: 'Candidate non trouvée.',
  VOTING_CLOSED: 'Les votes sont fermés.',
  
  // Billets
  TICKET_SOLD_OUT: 'Billets épuisés.',
  TICKET_TYPE_INVALID: 'Type de billet invalide.',
  TICKET_ALREADY_USED: 'Ce billet a déjà été utilisé.'
}

// Messages de succès
export const SUCCESS_MESSAGES = {
  // Votes
  VOTE_SUCCESS: 'Vote enregistré avec succès! Merci pour votre participation.',
  VOTE_PROCESSING: 'Traitement de votre vote en cours...',
  
  // Billets
  TICKET_PURCHASE_SUCCESS: 'Billet acheté avec succès! Votre PDF est prêt.',
  TICKET_DOWNLOAD_SUCCESS: 'Billet téléchargé avec succès.',
  TICKET_SENT_SUCCESS: 'Billet envoyé par email avec succès.',
  
  // Général
  PROFILE_UPDATED: 'Profil mis à jour avec succès.',
  SETTINGS_SAVED: 'Paramètres sauvegardés avec succès.',
  DATA_EXPORTED: 'Données exportées avec succès.'
}

// Couleurs du thème
export const THEME_COLORS = {
  PRIMARY: {
    DEFAULT: '#003366',
    50: '#e6f0ff',
    100: '#cce0ff',
    200: '#99c2ff',
    300: '#66a3ff',
    400: '#3385ff',
    500: '#003366',
    600: '#002952',
    700: '#001f3d',
    800: '#001429',
    900: '#000a14'
  },
  SECONDARY: {
    DEFAULT: '#D4AF37',
    50: '#fdf8e8',
    100: '#fbf1d1',
    200: '#f7e3a3',
    300: '#f3d575',
    400: '#efc747',
    500: '#D4AF37',
    600: '#aa8c2c',
    700: '#7f6921',
    800: '#554616',
    900: '#2a230b'
  },
  ACCENT: {
    DEFAULT: '#8B0000',
    50: '#ffe6e6',
    100: '#ffcccc',
    200: '#ff9999',
    300: '#ff6666',
    400: '#ff3333',
    500: '#8B0000',
    600: '#6f0000',
    700: '#530000',
    800: '#380000',
    900: '#1c0000'
  },
  NEUTRAL: {
    DEFAULT: '#6B7280',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
}

// Types de billets
export const TICKET_TYPES = [
  {
    id: 'single',
    name: 'Billet 1 Personne',
    price: 12000,
    description: 'Accès standard pour 1 personne',
    features: [
      'Accès à la soirée',
      'Place assise standard',
      'Cadeau de bienvenue',
      'Rafraîchissements'
    ],
    icon: 'user',
    color: 'blue'
  },
  {
    id: 'couple',
    name: 'Billet Couple',
    price: 20000,
    description: 'Accès pour 2 personnes',
    features: [
      'Accès pour 2 personnes',
      'Places côte à côte',
      'Cadeaux de bienvenue',
      'Rafraîchissements premium'
    ],
    icon: 'users',
    color: 'green'
  },
  {
    id: 'group',
    name: 'Billet Groupe (5 personnes)',
    price: 51000,
    description: 'Accès pour un groupe de 5 personnes',
    features: [
      'Accès pour 5 personnes',
      'Table réservée',
      'Service dédié',
      'Cadeaux spéciaux',
      'Photo de groupe'
    ],
    icon: 'users-group',
    color: 'purple'
  },
  {
    id: 'vip',
    name: 'Billet VIP',
    price: 15000,
    description: 'Accès VIP avec avantages exclusifs',
    features: [
      'Accès VIP',
      'Place en avant',
      'Rencontre avec les candidates',
      'Cadeau VIP',
      'Buffet premium',
      'Photo souvenir'
    ],
    icon: 'crown',
    color: 'gold'
  }
]

// Configuration KkiaPay
export const KKIAPAY_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
  PRIVATE_KEY: import.meta.env.VITE_KKIAPAY_PRIVATE_KEY,
  SECRET_KEY: import.meta.env.VITE_KKIAPAY_SECRET,
  CALLBACK_URL: `${window.location.origin}/success`,
  WEBHOOK_URL: 'https://your-webhook-url.com/kkiapay',
  THEME: 'black',
  POSITION: 'center'
}

// Configuration Supabase
export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL,
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  TABLES: {
    CANDIDATES: 'candidates',
    VOTES: 'votes',
    TICKETS: 'tickets',
    TRANSACTIONS: 'transactions',
    ADMIN_SETTINGS: 'admin_settings'
  }
}

// URLs Supabase Storage
const SUPABASE_STORAGE_URL = 'https://aszyvsnfdmtadjvhhbzs.supabase.co/storage/v1/object/public'

// URLs des ressources
export const ASSET_URLS = {
  LOGOS: {
    AEMC: `${SUPABASE_STORAGE_URL}/logos/aemc-logo.png`,
    GUI_LOK: `${SUPABASE_STORAGE_URL}/logos/guilok-logo.png`,
    MISS_FSS: `${SUPABASE_STORAGE_URL}/logos/miss-fss-logo.png`,
    FSS: `${SUPABASE_STORAGE_URL}/logos/fss-logo.png`,
    DEV_PHOTO: `${SUPABASE_STORAGE_URL}/logos/dev-photo.jpg`
  },
  IMAGES: {
    HERO_BG: `${SUPABASE_STORAGE_URL}/backgrounds/hero-bg.jpg`,
    EVENT_BG: `${SUPABASE_STORAGE_URL}/backgrounds/event-bg.jpg`,
    DEFAULT_CANDIDATE: `${SUPABASE_STORAGE_URL}/candidates-photos/default.jpg`
  },
  ICONS: {
    VOTE: '🎯',
    TICKET: '🎫',
    CALENDAR: '📅',
    LOCATION: '📍',
    PHONE: '📱',
    EMAIL: '✉️',
    USER: '👤',
    USERS: '👥',
    CROWN: '👑',
    STAR: '⭐',
    HEART: '❤️',
    FIRE: '🔥'
  }
}

// Fonctions utilitaires pour les URLs
export const getCandidatePhotoUrl = (candidateNumber) => {
  return `https://aszyvsnfdmtadjvhhbzs.supabase.co/storage/v1/object/public/candidates-photos/candidate-1.jpg`
}

export const getLogoUrl = (logoName) => {
  return `${SUPABASE_STORAGE_URL}/logos/${logoName}`
}

export const getBackgroundUrl = (bgName) => {
  return `${SUPABASE_STORAGE_URL}/backgrounds/${bgName}`
}

// Fonctions utilitaires
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' FCFA'
}

export const formatDate = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  try {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return date
  }
}

export const generateTransactionId = (prefix = 'TXN') => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `${prefix}_${timestamp}_${random}`
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  // Format téléphone Bénin: +229 XX XX XX XX ou 0X XX XX XX XX
  const re = /^(?:\+229|00229|0)[1-9]\d{7}$/
  return re.test(phone.replace(/\s/g, ''))
}

export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export default {
  APP_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME_COLORS,
  TICKET_TYPES,
  KKIAPAY_CONFIG,
  SUPABASE_CONFIG,
  ASSET_URLS,
  getCandidatePhotoUrl,
  getLogoUrl,
  getBackgroundUrl,
  formatCurrency,
  formatDate,
  generateTransactionId,
  validateEmail,
  validatePhone,
  truncateText
}