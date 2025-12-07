import { createClient } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Configuration des tables
export const TABLES = {
  CANDIDATES: 'candidates',
  VOTES: 'votes',
  TICKETS: 'tickets',
  TRANSACTIONS: 'transactions',
  ADMIN_SETTINGS: 'admin_settings'
}

// Fonctions utilitaires pour Supabase
export const handleSupabaseError = (error, customMessage = null) => {
  console.error('Supabase Error:', error)
  
  if (error.code === 'PGRST301') {
    toast.error('Session expirée. Veuillez vous reconnecter.')
    return
  }
  
  if (error.code === '23505') {
    toast.error('Cette transaction existe déjà.')
    return
  }
  
  const message = customMessage || error.message || 'Une erreur est survenue'
  toast.error(message)
  
  return {
    success: false,
    error: message
  }
}

// Fonction pour vérifier la connexion
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CANDIDATES)
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    return {
      success: true,
      connected: true
    }
  } catch (error) {
    return handleSupabaseError(error, 'Impossible de se connecter à la base de données')
  }
}

// Fonction pour initialiser les données
export const initializeData = async () => {
  try {
    // Vérifier si des candidates existent déjà
    const { data: candidates, error: candidatesError } = await supabase
      .from(TABLES.CANDIDATES)
      .select('*')
    
    if (candidatesError) throw candidatesError
    
    // Si aucune candidate, créer les 10 candidates par défaut
    if (!candidates || candidates.length === 0) {
      const defaultCandidates = Array.from({ length: 10 }, (_, i) => ({
        name: `Candidate ${i + 1}`,
        candidate_number: i + 1,
        description: `Étudiante en médecine passionnée et engagée #${i + 1}`,
        photo_url: `/candidates/candidate-${i + 1}.jpg`,
        votes_count: 0
      }))
      
      const { error: insertError } = await supabase
        .from(TABLES.CANDIDATES)
        .insert(defaultCandidates)
      
      if (insertError) throw insertError
      
      console.log('10 candidates créées avec succès')
    }
    
    return { success: true }
  } catch (error) {
    return handleSupabaseError(error, 'Erreur lors de l\'initialisation des données')
  }
}

export default supabase