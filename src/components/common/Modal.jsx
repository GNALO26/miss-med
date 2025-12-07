import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  isLoading = false,
  actions
}) => {
  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Empêcher le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : null}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`${sizeClasses[size]} w-full bg-white rounded-2xl shadow-2xl overflow-hidden`}
            >
              {/* Header */}
              {title && (
                <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-primary-50 to-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        aria-label="Fermer"
                      >
                        <X size={20} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                {isLoading ? (
                  <div className="py-12 flex items-center justify-center">
                    <LoadingSpinner size="lg" message="Chargement..." />
                  </div>
                ) : (
                  children
                )}
              </div>

              {/* Actions */}
              {actions && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    {actions}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Composants de modals spécifiques
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer l\'action',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmColor = 'primary',
  isLoading = false
}) => {
  const colorClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700',
    secondary: 'bg-secondary-600 hover:bg-secondary-700',
    accent: 'bg-accent-600 hover:bg-accent-700',
    danger: 'bg-red-600 hover:bg-red-700'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="py-4">
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${colorClasses[confirmColor]} disabled:opacity-50`}
        >
          {isLoading ? 'Traitement...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}

export const SuccessModal = ({ isOpen, onClose, title, message }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
  >
    <div className="py-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">✅</span>
      </div>
      <p className="text-gray-700">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Continuer
      </button>
    </div>
  </Modal>
)

export const ErrorModal = ({ isOpen, onClose, title, message, error }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || 'Erreur'}
    size="sm"
  >
    <div className="py-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">❌</span>
      </div>
      <p className="text-gray-700">{message}</p>
      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700 font-mono">{error}</p>
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        Fermer
      </button>
    </div>
  </Modal>
)

export const InfoModal = ({ isOpen, onClose, title, message, icon = 'ℹ️' }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
  >
    <div className="py-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-gray-700">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Compris
      </button>
    </div>
  </Modal>
)

export default Modal