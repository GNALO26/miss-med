import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  fullScreen = false,
  message = 'Chargement...'
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        />
        <div className="absolute inset-0 border-2 border-transparent border-t-current rounded-full animate-ping opacity-20"></div>
      </div>
      {message && (
        <p className={`mt-3 font-medium ${colorClasses[color]} text-center`}>
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}

// Variants pour différents usages
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <LoadingSpinner size="xl" message="Chargement de l'application..." />
  </div>
)

export const ContentLoader = () => (
  <div className="py-12 flex items-center justify-center">
    <LoadingSpinner size="lg" message="Chargement du contenu..." />
  </div>
)

export const ButtonLoader = ({ text = 'Traitement en cours...' }) => (
  <div className="flex items-center justify-center space-x-2">
    <LoadingSpinner size="sm" color="white" />
    <span className="text-sm">{text}</span>
  </div>
)

export const InlineLoader = () => (
  <div className="inline-flex items-center space-x-2">
    <LoadingSpinner size="xs" />
    <span className="text-sm text-gray-600">Chargement...</span>
  </div>
)

export default LoadingSpinner