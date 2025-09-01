"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading, useToast } from "../../hooks";
import { FullScreenLoader, ButtonLoader, ToastContainer } from "../../components/ui";

interface Designation {
  id: number;
  arbitre_name: string;
  type_designation_display: string;
  status_display: string;
  date_designation: string;
  notification_envoyee: boolean;
  match_summary: string;
}

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  match_time: string;
  stadium: string;
}

interface Arbitre {
  id: number;
  first_name: string;
  last_name: string;
  grade: string;
  phone_number: string;
}

export default function DesignationsPage() {
  const router = useRouter();
  const { setLoading, isLoading } = useLoading();
  const { toasts, showError, showSuccess, removeToast } = useToast();
  
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [arbitres, setArbitres] = useState<Arbitre[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<number | ''>('');
  const [selectedArbitre, setSelectedArbitre] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [commentaires, setCommentaires] = useState('');

  // Types de désignation
  const designationTypes = [
    { value: 'arbitre_principal', label: 'Arbitre Principal' },
    { value: 'arbitre_assistant1', label: '1er Arbitre Assistant' },
    { value: 'arbitre_assistant2', label: '2ème Arbitre Assistant' },
    { value: 'quatrieme_arbitre', label: '4ème Arbitre' },
    { value: 'arbitre_video', label: 'Arbitre VAR' },
    { value: 'arbitre_assistant_video', label: 'Assistant VAR' },
  ];

  // Charger les données
  useEffect(() => {
    loadDesignations();
    loadMatches();
    loadArbitres();
  }, []);

  const loadDesignations = async () => {
    try {
      setLoading('designations', true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/matches/designations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDesignations(data.designations || []);
      } else {
        showError('Erreur lors du chargement des désignations');
      }
    } catch (error) {
      console.error('Erreur de chargement des désignations:', error);
      showError('Erreur lors du chargement des désignations');
    } finally {
      setLoading('designations', false);
    }
  };

  const loadMatches = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/matches/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Erreur de chargement des matchs:', error);
    }
  };

  const loadArbitres = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/accounts/arbitres/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArbitres(data.arbitres || []);
      }
    } catch (error) {
      console.error('Erreur de chargement des arbitres:', error);
    }
  };

  const handleCreateDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatch || !selectedArbitre || !selectedType) {
      showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading('create', true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/matches/designations/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          match: selectedMatch,
          arbitre: selectedArbitre,
          type_designation: selectedType,
          commentaires: commentaires
        })
      });

      if (response.ok) {
        const data = await response.json();
        showSuccess('Désignation créée avec succès !');
        setShowCreateForm(false);
        resetForm();
        loadDesignations(); // Recharger la liste
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur de création:', error);
      showError('Erreur lors de la création de la désignation');
    } finally {
      setLoading('create', false);
    }
  };

  const resetForm = () => {
    setSelectedMatch('');
    setSelectedArbitre('');
    setSelectedType('');
    setCommentaires('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Proposée': return 'bg-yellow-100 text-yellow-800';
      case 'Acceptée': return 'bg-green-100 text-green-800';
      case 'Refusée': return 'bg-red-100 text-red-800';
      case 'Confirmée': return 'bg-blue-100 text-blue-800';
      case 'Annulée': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading('designations')) {
    return <FullScreenLoader message="Chargement des désignations..." isVisible={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏆 Désignations d&apos;Arbitrage
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les désignations des arbitres pour les matchs
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/home')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </button>
              
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvelle Désignation
              </button>
            </div>
          </div>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <div className="mb-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✨ Créer une nouvelle désignation
            </h2>
            
            <form onSubmit={handleCreateDesignation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sélection du match */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Match *
                  </label>
                  <select
                    value={selectedMatch}
                    onChange={(e) => setSelectedMatch(Number(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un match</option>
                    {matches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {match.home_team} vs {match.away_team} - {new Date(match.match_date).toLocaleDateString('fr-FR')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sélection de l'arbitre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arbitre *
                  </label>
                  <select
                    value={selectedArbitre}
                    onChange={(e) => setSelectedArbitre(Number(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un arbitre</option>
                    {arbitres.map((arbitre) => (
                      <option key={arbitre.id} value={arbitre.id}>
                        {arbitre.first_name} {arbitre.last_name} - {arbitre.grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type de désignation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de désignation *
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner le type</option>
                    {designationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Commentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaires
                </label>
                <textarea
                  value={commentaires}
                  onChange={(e) => setCommentaires(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Commentaires optionnels..."
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading('create')}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading('create') ? (
                    <ButtonLoader size="sm" />
                  ) : (
                    'Créer la désignation'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des désignations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              📋 Liste des désignations ({designations.length})
            </h3>
          </div>
          
          {designations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune désignation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer votre première désignation d&apos;arbitrage.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arbitre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notification
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {designations.map((designation) => (
                    <tr key={designation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {designation.arbitre_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {designation.type_designation_display}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {designation.match_summary}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(designation.status_display)}`}>
                          {designation.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(designation.date_designation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Container des toasts */}
        <ToastContainer 
          toasts={toasts}
          onRemoveToast={removeToast}
        />
      </div>
    </div>
  );
}

