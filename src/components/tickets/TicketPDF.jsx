import React from 'react'
import { jsPDF } from 'jspdf'
import { formatCurrency } from '../../services/utils/constants'

// Fonction pour générer le PDF du billet
export const generateTicketPDF = async (ticketData, buyerInfo) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Couleurs
    const primaryColor = [0, 51, 102] // #003366
    const secondaryColor = [212, 175, 55] // #D4AF37
    const accentColor = [139, 0, 0] // #8B0000

    // Background
    doc.setFillColor(248, 249, 250)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Header avec dégradé simulé
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 60, 'F')
    
    doc.setFillColor(0, 51, 102, 0.8)
    doc.rect(0, 40, pageWidth, 20, 'F')

    // Logo et titre (simulé avec du texte)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(32)
    doc.setFont('helvetica', 'bold')
    doc.text('MISS FSS 2026', pageWidth / 2, 25, { align: 'center' })
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('Faculté des Sciences de Santé', pageWidth / 2, 35, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...secondaryColor)
    doc.text('BILLET D\'ENTRÉE', pageWidth / 2, 50, { align: 'center' })

    // Ligne de séparation dorée
    doc.setDrawColor(...secondaryColor)
    doc.setLineWidth(0.5)
    doc.line(15, 65, pageWidth - 15, 65)

    // Informations du billet
    let yPos = 80

    // Type de billet
    doc.setFillColor(240, 242, 245)
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F')
    
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('TYPE DE BILLET', 20, yPos + 8)
    
    const ticketTypes = {
      single: 'Billet 1 Personne',
      couple: 'Billet Couple (2 personnes)',
      group: 'Billet Groupe (5 personnes)',
      vip: 'Billet VIP'
    }
    
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...accentColor)
    doc.text(ticketTypes[ticketData.ticket_type] || ticketData.ticket_type, 20, yPos + 20)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Quantité: ${ticketData.quantity}`, 20, yPos + 28)

    yPos += 45

    // Informations de l'acheteur
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(200, 200, 200)
    doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, 'FD')
    
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMATIONS DE L\'ACHETEUR', 20, yPos + 8)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text(`Nom: ${buyerInfo.name || ticketData.buyer_name}`, 20, yPos + 18)
    doc.text(`Email: ${buyerInfo.email || ticketData.buyer_email}`, 20, yPos + 26)
    doc.text(`Téléphone: ${buyerInfo.phone || ticketData.buyer_phone}`, 20, yPos + 34)

    yPos += 55

    // Prix
    doc.setFillColor(...secondaryColor)
    doc.roundedRect(15, yPos, (pageWidth - 30) / 2 - 5, 30, 3, 3, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('PRIX UNITAIRE', 20, yPos + 8)
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(formatCurrency(ticketData.unit_price), 20, yPos + 20)

    // Prix total
    doc.setFillColor(...accentColor)
    doc.roundedRect(pageWidth / 2 + 5, yPos, (pageWidth - 30) / 2 - 5, 30, 3, 3, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('PRIX TOTAL', pageWidth / 2 + 10, yPos + 8)
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(formatCurrency(ticketData.total_price), pageWidth / 2 + 10, yPos + 20)

    yPos += 40

    // QR Code (simulé avec un carré et du texte)
    const qrSize = 60
    const qrX = (pageWidth - qrSize) / 2
    
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(1)
    doc.rect(qrX, yPos, qrSize, qrSize, 'FD')
    
    // Simuler un QR code avec une grille
    doc.setFillColor(...primaryColor)
    const cellSize = 3
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.5) {
          doc.rect(qrX + 5 + i * cellSize, yPos + 5 + j * cellSize, cellSize, cellSize, 'F')
        }
      }
    }
    
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('Scannez à l\'entrée', pageWidth / 2, yPos + qrSize + 8, { align: 'center' })

    yPos += qrSize + 20

    // Numéro de billet
    doc.setFillColor(240, 242, 245)
    doc.roundedRect(15, yPos, pageWidth - 30, 20, 3, 3, 'F')
    
    doc.setTextColor(...primaryColor)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('NUMÉRO DE BILLET', 20, yPos + 6)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(ticketData.id.toUpperCase(), 20, yPos + 14)

    yPos += 30

    // Informations de l'événement
    doc.setDrawColor(...secondaryColor)
    doc.setLineWidth(0.5)
    doc.line(15, yPos, pageWidth - 15, yPos)
    
    yPos += 10
    
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('DÉTAILS DE L\'ÉVÉNEMENT', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    doc.text('📅 Date: 24 Janvier 2025 à 18h00', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 8
    doc.text('📍 Lieu: Faculté des Sciences de Santé, Cotonou', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 8
    doc.text('🎉 Grande soirée de gala Miss FSS 2024', pageWidth / 2, yPos, { align: 'center' })

    // Footer
    yPos = pageHeight - 40
    
    doc.setDrawColor(...secondaryColor)
    doc.setLineWidth(0.5)
    doc.line(15, yPos, pageWidth - 15, yPos)
    
    yPos += 8
    
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('Organisé par AEMC • Développé par GUI-LOK Dev', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 6
    doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 6
    doc.setFontSize(7)
    doc.text('Ce billet est personnel et non transférable. Conservez-le jusqu\'à l\'événement.', pageWidth / 2, yPos, { align: 'center' })

    // Générer le PDF
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)

    return {
      success: true,
      blob: pdfBlob,
      url: pdfUrl,
      filename: `billet-miss-fss-${ticketData.id.substring(0, 8)}.pdf`
    }
  } catch (error) {
    console.error('PDF generation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Fonction pour télécharger le PDF
export const downloadTicketPDF = async (ticketData, buyerInfo) => {
  try {
    const result = await generateTicketPDF(ticketData, buyerInfo)
    
    if (result.success) {
      const link = document.createElement('a')
      link.href = result.url
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(result.url)
      
      return { success: true }
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Download error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Composant React pour prévisualiser le billet
const TicketPDF = ({ ticketData, buyerInfo }) => {
  const [generating, setGenerating] = React.useState(false)

  const handleGeneratePDF = async () => {
    setGenerating(true)
    try {
      await downloadTicketPDF(ticketData, buyerInfo)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aperçu du billet
          </h3>
          <p className="text-gray-600">
            Cliquez pour générer et télécharger votre billet PDF
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{ticketData.ticket_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantité:</span>
            <span className="font-medium">{ticketData.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prix total:</span>
            <span className="font-bold text-primary-600">
              {formatCurrency(ticketData.total_price)}
            </span>
          </div>
        </div>

        <button
          onClick={handleGeneratePDF}
          disabled={generating}
          className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {generating ? 'Génération en cours...' : 'Télécharger le billet PDF'}
        </button>
      </div>
    </div>
  )
}

export default TicketPDF