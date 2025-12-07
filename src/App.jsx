import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { VotingProvider } from './contexts/VotingContext'
import { AuthProvider } from './contexts/AuthContext'

// Layout Components
import Header from './components/common/Header'
import Footer from './components/common/Footer'

// Router
import AppRouter from './router'

// Styles
import './styles/globals.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <VotingProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />
            <main className="flex-grow">
              <AppRouter />
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#003366',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '16px',
                },
                success: {
                  style: {
                    background: '#28a745',
                  },
                },
                error: {
                  style: {
                    background: '#dc3545',
                  },
                },
              }}
            />
          </div>
        </VotingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App