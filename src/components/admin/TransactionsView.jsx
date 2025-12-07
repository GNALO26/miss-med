import React, { useState, useEffect } from 'react'
import { 
  Download, Search, Filter, RefreshCw, Eye, 
  ChevronLeft, ChevronRight, DollarSign, Calendar,
  User, CreditCard, CheckCircle, XCircle, Clock
} from 'lucide-react'
import { adminService } from '../../services/supabase/admin'
import { votesService } from '../../services/supabase/votes'
import { ticketsService } from '../../services/supabase/tickets'
import { formatCurrency } from '../../services/utils/constants'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../common/Modal'

const TransactionsView = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  })
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [page, filters])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      
      const result = await adminService.getAllTransactions(page, 50, filters)
      
      if (result.success) {
        setTransactions(result.data || [])
        setTotalPages(result.totalPages || 1)
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      toast.error('Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const result = await adminService.exportAllData()
      
      if (result.success) {
        const blob = new Blob([result.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = result.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast.success('Export réussi !')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }

    const icons = {
      completed: <CheckCircle size={16} />,
      pending: <Clock size={16} />,
      failed: <XCircle size={16} />,
      refunded: <RefreshCw size={16} />
    }

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  const getTypeBadge = (type) => {
    const styles = {
      vote: 'bg-blue-100 text-blue-800',
      ticket: 'bg-green-100 text-green-800'
    }

    const icons = {
      vote: '🗳️',
      ticket: '🎫'
    }

    return (
      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${styles[type] || styles.vote}`}>
        <span>{icons[type]}</span>
        <span className="capitalize">{type}</span>
      </span>
    )
  }

  if (loading && page === 1) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <LoadingSpinner size="xl" message="Chargement des transactions..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-gray-600">
            {transactions.length} transaction(s) sur cette page
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadTransactions}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Actualiser</span>
          </button>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email, ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="vote">Votes</option>
            <option value="ticket">Billets</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Client</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Montant</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Statut</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard size={16} className="text-gray-400" />
                      <span className="font-mono text-sm text-gray-900">
                        {transaction.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getTypeBadge(transaction.type)}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.metadata?.buyer_name || transaction.metadata?.voter_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.metadata?.buyer_email || transaction.metadata?.voter_email || ''}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-primary-600">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-gray-500">
                        {new Date(transaction.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewDetails(transaction)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Aucune transaction trouvée
            </h3>
            <p className="text-gray-600">
              Les transactions apparaîtront ici une fois que les paiements seront effectués
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page} sur {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Détails de la transaction"
        size="lg"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">ID Transaction</div>
                <div className="font-mono font-medium">
                  {selectedTransaction.id}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div>{getTypeBadge(selectedTransaction.type)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Montant</div>
                <div className="font-bold text-primary-600 text-xl">
                  {formatCurrency(selectedTransaction.amount)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Statut</div>
                <div>{getStatusBadge(selectedTransaction.status)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Méthode de paiement</div>
                <div className="font-medium">{selectedTransaction.payment_method}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Date</div>
                <div className="font-medium">
                  {new Date(selectedTransaction.created_at).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>

            {selectedTransaction.metadata && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Informations supplémentaires</h4>
                <div className="space-y-2">
                  {Object.entries(selectedTransaction.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="font-medium text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TransactionsView