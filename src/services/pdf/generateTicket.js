import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const generateTicketPDF = async (ticket, buyerInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297] // A4
      })
      
      // Configuration
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      
      // Couleurs
      const primaryColor = [0, 51, 102] // #003366
      const secondaryColor = [212, 175, 55] // #D4AF37
      const accentColor = [139, 0, 0] // #8B0000
      const lightGray = [240, 240, 240]
      
      // Fonction pour dessiner un rectangle arrondi
      const roundedRect = (x, y, width, height, radius) => {
        doc.roundedRect(x, y, width, height, radius, radius)
      }
      
      // 1. En-tête avec logo et fond
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.rect(0, 0, pageWidth, 60, 'F')
      
      // Titre
      doc.setFontSize(24)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('MISS FSS 2024', pageWidth / 2, 25, { align: 'center' })
      
      doc.setFontSize(16)
      doc.text('SOIRÉE DE GALA & ÉLECTION', pageWidth / 2, 35, { align: 'center' })
      
      // 2. Section principale
      let yPosition = 80
      
      // Cadre principal
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setLineWidth(0.5)
      roundedRect(margin, yPosition, contentWidth, 150, 5)
      
      // Titre du billet
      doc.setFontSize(20)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setFont('helvetica', 'bold')
      doc.text('BILLET D\'ENTRÉE', pageWidth / 2, yPosition + 20, { align: 'center' })
      
      // Ligne décorative
      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      doc.setLineWidth(1)
      doc.line(margin + 50, yPosition + 25, pageWidth - margin - 50, yPosition + 25)
      
      yPosition += 40
      
      // Informations du billet
      doc.setFontSize(12)
      doc.setTextColor(50, 50, 50)
      doc.setFont('helvetica', 'normal')
      
      const ticketTypes = {
        single: { name: 'Billet 1 Personne', price: 12000 },
        couple: { name: 'Billet Couple', price: 20000 },
        group: { name: 'Billet Groupe (5 personnes)', price: 51000 },
        vip: { name: 'Billet VIP', price: 15000 }
      }
      
      const ticketType = ticketTypes[ticket.ticket_type] || { name: 'Billet Standard', price: 0 }
      
      // Colonne gauche - Informations événement
      doc.setFont('helvetica', 'bold')
      doc.text('ÉVÉNEMENT:', margin + 10, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text('Élection Miss FSS 2024', margin + 10, yPosition + 7)
      doc.text('Faculté des Sciences de Santé', margin + 10, yPosition + 14)
      doc.text('Soirée de Gala & Remise des Prix', margin + 10, yPosition + 21)
      
      // Colonne droite - Informations billet
      const rightColumnX = pageWidth - margin - 100
      
      doc.setFont('helvetica', 'bold')
      doc.text('TYPE DE BILLET:', rightColumnX, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text(ticketType.name, rightColumnX, yPosition + 7)
      
      doc.setFont('helvetica', 'bold')
      doc.text('QUANTITÉ:', rightColumnX, yPosition + 21)
      doc.setFont('helvetica', 'normal')
      doc.text(`${ticket.quantity} personne(s)`, rightColumnX, yPosition + 28)
      
      doc.setFont('helvetica', 'bold')
      doc.text('PRIX TOTAL:', rightColumnX, yPosition + 42)
      doc.setFont('helvetica', 'normal')
      doc.text(`${ticket.total_price.toLocaleString('fr-FR')} FCFA`, rightColumnX, yPosition + 49)
      
      yPosition += 60
      
      // Informations acheteur
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
      doc.rect(margin + 5, yPosition, contentWidth - 10, 40, 'F')
      
      doc.setFontSize(14)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setFont('helvetica', 'bold')
      doc.text('INFORMATIONS DE L\'ACHETEUR', pageWidth / 2, yPosition + 15, { align: 'center' })
      
      doc.setFontSize(11)
      doc.setTextColor(50, 50, 50)
      doc.setFont('helvetica', 'normal')
      
      doc.text(`Nom: ${buyerInfo.name}`, margin + 15, yPosition + 25)
      doc.text(`Email: ${buyerInfo.email}`, margin + 15, yPosition + 32)
      doc.text(`Téléphone: ${buyerInfo.phone}`, margin + 15, yPosition + 39)
      
      // Colonne droite - Date et ID
      doc.text(`Date d'achat: ${format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}`, 
               pageWidth - margin - 100, yPosition + 25)
      doc.text(`ID du billet: ${ticket.id.substring(0, 8).toUpperCase()}`, 
               pageWidth - margin - 100, yPosition + 32)
      
      yPosition += 50
      
      // Code QR (espace réservé)
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('PRÉSENTER CE BILLET À L\'ENTRÉE', pageWidth / 2, yPosition + 40, { align: 'center' })
      
      // Dessiner un cadre pour le QR code
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      const qrSize = 40
      const qrX = pageWidth / 2 - qrSize / 2
      const qrY = yPosition
      doc.rect(qrX, qrY, qrSize, qrSize)
      
      // Texte dans le cadre QR
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('QR CODE', pageWidth / 2, qrY + qrSize / 2, { align: 'center' })
      doc.text('SCAN ME', pageWidth / 2, qrY + qrSize / 2 + 4, { align: 'center' })
      
      // 3. Pied de page
      const footerY = pageHeight - 40
      
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, footerY, pageWidth - margin, footerY)
      
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      
      // Logo AEMC
      doc.text('Organisé par: AEMC', margin + 10, footerY + 10)
      
      // Logo développeur
      doc.text('Développé par: GUI-LOK Dev', pageWidth - margin - 10, footerY + 10, { align: 'right' })
      
      // Conditions
      doc.setFontSize(8)
      doc.text('Ce billet est strictement personnel et non transférable.', pageWidth / 2, footerY + 20, { align: 'center' })
      doc.text('Toute reproduction ou falsification est interdite.', pageWidth / 2, footerY + 25, { align: 'center' })
      
      // 4. Générer le PDF
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      // 5. Générer un nom de fichier
      const fileName = `billet-miss-fss-${ticket.id.substring(0, 8)}.pdf`
      
      resolve({
        success: true,
        url: pdfUrl,
        blob: pdfBlob,
        fileName: fileName,
        base64: doc.output('datauristring')
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      reject(error)
    }
  })
}

// Fonction pour télécharger le PDF
export const downloadTicketPDF = async (ticket, buyerInfo) => {
  try {
    const result = await generateTicketPDF(ticket, buyerInfo)
    
    if (result.success) {
      // Créer un lien de téléchargement
      const link = document.createElement('a')
      link.href = result.url
      link.download = result.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Libérer l'URL après le téléchargement
      setTimeout(() => {
        URL.revokeObjectURL(result.url)
      }, 100)
      
      return {
        success: true,
        message: 'PDF téléchargé avec succès'
      }
    }
    
    return result
  } catch (error) {
    console.error('Error downloading PDF:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Fonction pour afficher le PDF dans un nouvel onglet
export const viewTicketPDF = async (ticket, buyerInfo) => {
  try {
    const result = await generateTicketPDF(ticket, buyerInfo)
    
    if (result.success) {
      // Ouvrir dans un nouvel onglet
      window.open(result.url, '_blank')
      
      return {
        success: true,
        message: 'PDF ouvert dans un nouvel onglet'
      }
    }
    
    return result
  } catch (error) {
    console.error('Error viewing PDF:', error)
    return {
      success: false,
      error: error.message
    }
  }
}