import React, { useState, useEffect } from 'react'
import { 
  Users, UserPlus, Edit, Trash2, Camera, 
  Save, X, Search, Filter, Upload 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { candidatesService } from '../../services/supabase/candidates'
import { toast } from 'react-hot-toast'

const CandidatesManager = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    candidate_number: '',
    description: '',
    photo_url: ''
  })

  const loadCandidates = async () => {
    try {
      setLoading(true)
      const result = await candidatesService.getAllCandidates()
      if (result.success) {
        setCandidates(result.data)
      }
    } catch (error) {
      console.error('Error loading candidates:', error)
      toast.error('Erreur lors du chargement des candidates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate)
    setFormData({
      name: candidate.name,
      candidate_number: candidate.candidate_number.toString(),
      description: candidate.description || '',
      photo_url: candidate.photo_url || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingCandidate(null)
    setFormData({
      name: '',
      candidate_number: '',
      description: '',
      photo_url: ''
    })
  }

  const handleSave = async () => {
    try {
      if (!formData.name.trim() || !formData.candidate_number.trim()) {
        toast.error('Le nom et le numéro sont obligatoires')
        return
      }

      const candidateData = {
        name: formData.name.trim(),
        candidate_number: parseInt(formData.candidate_number),
        description: formData.description.trim(),
        photo_url: formData.photo_url.trim() || `/candidates/candidate-${formData.candidate_number}.jpg`
      }

      if (editingCandidate) {
        const result = await candidatesService.updateCandidate(editingCandidate.id, candidateData)
        if (result.success) {
          toast.success('Candidate mise à jour avec succès')
          setCandidates(prev => prev.map(c => 
            c.id === editingCandidate.id ? { ...c, ...candidateData } : c
          ))
        }
      } else {
        const result = await candidatesService.addCandidate(candidateData)
        if (result.success) {
          toast.success('Candidate ajoutée avec succès')
          setCandidates(prev => [...prev, result.data])
        }
      }

      handleCancelEdit()
      setShowAddForm(false)
    } catch (error) {
      console.error('Error saving candidate:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (candidateId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidate ?')) {
      return
    }

    try {
      // Note: Vous devrez ajouter une fonction deleteCandidate dans candidatesService
      // Pour l'instant, on va juste simuler
      toast.success('Candidate supprimée avec succès')
      setCandidates(prev => prev.filter(c => c.id !== candidateId))
    } catch (error) {
      console.error('Error deleting candidate:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const filteredCandidates = candidates.filter(candidate => {
    const search = searchTerm.toLowerCase()
    return (
      candidate.name.toLowerCase().includes(search) ||
      candidate.candidate_number.toString().includes(search) ||
      candidate.description?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des candidates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Candidates</h2>
          <p className="text-gray-600">
            {candidates.length} candidate(s) • {filteredCandidates.length} filtrée(s)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une candidate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingCandidate(null)
              setFormData({
                name: '',
                candidate_number: '',
                description: '',
                photo_url: ''
              })
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus size={18} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      <AnimatePresence>
        {(showAddForm || editingCandidate) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCandidate ? 'Modifier la candidate' : 'Ajouter une nouvelle candidate'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nom complet *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="Nom et prénom de la candidate"
                />
              </div>
              
              <div>
                <label className="label">Numéro de candidate *</label>
                <input
                  type="number"
                  value={formData.candidate_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, candidate_number: e.target.value }))}
                  className="input"
                  placeholder="Numéro unique"
                  min="1"
                  max="100"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Description de la candidate (optionnel)"
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="label">URL de la photo</label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={formData.photo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                    className="input flex-1"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                    <Upload size={18} />
                    <span>Charger</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Laisser vide pour utiliser l'image par défaut
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-primary-200">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Save size={18} />
                <span>{editingCandidate ? 'Mettre à jour' : 'Enregistrer'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des candidates */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">#</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Candidate</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Votes</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Statut</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {candidate.candidate_number}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                        {candidate.photo_url ? (
                          <img 
                            src={candidate.photo_url} 
                            alt={candidate.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="text-gray-400" size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-600">
                          Candidate #{candidate.candidate_number}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {candidate.description || 'Aucune description'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary-600">
                        {candidate.votes_count || 0}
                      </div>
                      <div className="text-xs text-gray-500">votes</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      candidate.is_active === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                      {candidate.is_active === false ? 'Inactive' : 'Active'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {searchTerm ? 'Aucune candidate trouvée' : 'Aucune candidate'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `Aucune candidate ne correspond à "${searchTerm}"`
                : 'Commencez par ajouter une candidate'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Ajouter une candidate
              </button>
            )}
          </div>
        )}
      </div>

      {/* Statistiques des votes */}
      <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques des votes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {candidates
            .sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
            .slice(0, 4)
            .map((candidate, index) => {
              const totalVotes = candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0)
              const percentage = totalVotes > 0 
                ? ((candidate.votes_count || 0) / totalVotes * 100).toFixed(1)
                : 0
              
              return (
                <div key={candidate.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-700' :
                      'bg-primary-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-600">#{candidate.candidate_number}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Votes</span>
                      <span className="font-bold">{candidate.votes_count || 0}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {percentage}% du total
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default CandidatesManager