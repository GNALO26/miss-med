/**
 * Utilitaires de validation pour les formulaires
 */

// Valider un email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Valider un numéro de téléphone béninois
export const isValidPhone = (phone) => {
  // Format: +229XXXXXXXX ou 00229XXXXXXXX ou XXXXXXXX (8 chiffres)
  const phoneRegex = /^(\+229|00229)?[0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Formater un numéro de téléphone
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 8) {
    return `+229${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('229')) {
    return `+${cleaned}`
  } else if (cleaned.length === 13 && cleaned.startsWith('00229')) {
    return `+${cleaned.slice(2)}`
  }
  
  return phone
}

// Valider un nom (lettres, espaces, tirets, apostrophes)
export const isValidName = (name) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/
  return nameRegex.test(name)
}

// Valider un montant (nombre positif)
export const isValidAmount = (amount) => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

// Valider une quantité (entier positif)
export const isValidQuantity = (quantity) => {
  const num = parseInt(quantity, 10)
  return !isNaN(num) && num > 0 && Number.isInteger(num)
}

// Valider un URL
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Valider une date (format ISO ou Date object)
export const isValidDate = (date) => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d)
}

// Valider que la date est dans le futur
export const isFutureDate = (date) => {
  return new Date(date) > new Date()
}

// Valider que la date est dans le passé
export const isPastDate = (date) => {
  return new Date(date) < new Date()
}

// Valider un mot de passe (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Valider un code postal (format simple)
export const isValidPostalCode = (code) => {
  const postalCodeRegex = /^[0-9]{4,6}$/
  return postalCodeRegex.test(code)
}

// Validation complète d'un formulaire de votant
export const validateVoterForm = (data) => {
  const errors = {}

  // Nom
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Le nom est requis'
  } else if (!isValidName(data.name)) {
    errors.name = 'Le nom doit contenir uniquement des lettres (2-50 caractères)'
  }

  // Email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'L\'email est requis'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'L\'email n\'est pas valide'
  }

  // Téléphone
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'Le numéro de téléphone est requis'
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Le numéro de téléphone n\'est pas valide (format: +229XXXXXXXX)'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validation complète d'un formulaire d'achat de billet
export const validateTicketForm = (data) => {
  const errors = {}

  // Type de billet
  if (!data.ticketType) {
    errors.ticketType = 'Veuillez sélectionner un type de billet'
  }

  // Quantité
  if (!data.quantity) {
    errors.quantity = 'La quantité est requise'
  } else if (!isValidQuantity(data.quantity)) {
    errors.quantity = 'La quantité doit être un nombre entier positif'
  } else if (data.quantity > 10) {
    errors.quantity = 'Maximum 10 billets par transaction'
  }

  // Informations acheteur
  if (!data.buyerName || data.buyerName.trim().length === 0) {
    errors.buyerName = 'Le nom est requis'
  } else if (!isValidName(data.buyerName)) {
    errors.buyerName = 'Le nom n\'est pas valide'
  }

  if (!data.buyerEmail || data.buyerEmail.trim().length === 0) {
    errors.buyerEmail = 'L\'email est requis'
  } else if (!isValidEmail(data.buyerEmail)) {
    errors.buyerEmail = 'L\'email n\'est pas valide'
  }

  if (!data.buyerPhone || data.buyerPhone.trim().length === 0) {
    errors.buyerPhone = 'Le numéro de téléphone est requis'
  } else if (!isValidPhone(data.buyerPhone)) {
    errors.buyerPhone = 'Le numéro de téléphone n\'est pas valide'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validation d'un formulaire de connexion admin
export const validateAdminLogin = (data) => {
  const errors = {}

  if (!data.username || data.username.trim().length === 0) {
    errors.username = 'Le nom d\'utilisateur est requis'
  }

  if (!data.password || data.password.trim().length === 0) {
    errors.password = 'Le mot de passe est requis'
  } else if (data.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitizer une chaîne (enlever les caractères dangereux)
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return ''
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Enlever les balises HTML
    .slice(0, 500) // Limiter la longueur
}

// Sanitizer un email
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return ''
  
  return email
    .trim()
    .toLowerCase()
    .slice(0, 100)
}

// Sanitizer un numéro de téléphone
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return ''
  
  return phone
    .replace(/\s/g, '')
    .replace(/[^\d+]/g, '')
    .slice(0, 15)
}

// Valider un fichier d'image
export const isValidImageFile = (file) => {
  if (!file) return false
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

// Valider un fichier PDF
export const isValidPdfFile = (file) => {
  if (!file) return false
  
  const validTypes = ['application/pdf']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

// Valider un numéro de carte (format simple)
export const isValidCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '')
  return /^\d{13,19}$/.test(cleaned)
}

// Valider une date d'expiration de carte (MM/YY)
export const isValidCardExpiry = (expiry) => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!expiryRegex.test(expiry)) return false
  
  const [month, year] = expiry.split('/')
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month))
  const now = new Date()
  
  return expiryDate > now
}

// Valider un CVV
export const isValidCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv)
}

// Créer un message d'erreur formaté
export const formatErrorMessage = (field, errorType) => {
  const messages = {
    required: `Le champ ${field} est requis`,
    invalid: `Le champ ${field} n'est pas valide`,
    tooShort: `Le champ ${field} est trop court`,
    tooLong: `Le champ ${field} est trop long`,
    min: `Le champ ${field} doit être supérieur`,
    max: `Le champ ${field} doit être inférieur`,
    email: `L'adresse email n'est pas valide`,
    phone: `Le numéro de téléphone n'est pas valide`,
    url: `L'URL n'est pas valide`,
    date: `La date n'est pas valide`,
    password: `Le mot de passe ne respecte pas les critères de sécurité`
  }
  
  return messages[errorType] || `Le champ ${field} contient une erreur`
}

// Vérifier si tous les champs requis sont remplis
export const areRequiredFieldsFilled = (data, requiredFields) => {
  return requiredFields.every(field => {
    const value = data[field]
    return value !== null && value !== undefined && value.toString().trim().length > 0
  })
}

// Comparer deux mots de passe
export const passwordsMatch = (password1, password2) => {
  return password1 === password2
}

// Valider la force d'un mot de passe
export const getPasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*?&]/.test(password)) strength++
  
  if (strength <= 2) return { level: 'weak', label: 'Faible', color: 'red' }
  if (strength <= 4) return { level: 'medium', label: 'Moyen', color: 'yellow' }
  return { level: 'strong', label: 'Fort', color: 'green' }
}

export default {
  isValidEmail,
  isValidPhone,
  formatPhoneNumber,
  isValidName,
  isValidAmount,
  isValidQuantity,
  isValidUrl,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidPassword,
  isValidPostalCode,
  validateVoterForm,
  validateTicketForm,
  validateAdminLogin,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  isValidImageFile,
  isValidPdfFile,
  isValidCardNumber,
  isValidCardExpiry,
  isValidCVV,
  formatErrorMessage,
  areRequiredFieldsFilled,
  passwordsMatch,
  getPasswordStrength
}