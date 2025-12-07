import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import HomePage from './pages/HomePage'
import VotingPage from './pages/VotingPage'
import TicketsPage from './pages/TicketsPage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import SuccessPage from './pages/SuccessPage'
import NotFoundPage from './pages/NotFoundPage'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/voting" element={<VotingPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default Router