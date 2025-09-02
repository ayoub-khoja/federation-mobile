"use client";

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';

export default function DebugCINPage() {
  const { profile, isLoading, error, fetchProfile } = useProfile();
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const checkBackendResponse = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Token non trouvé - Veuillez vous connecter');
        return;
      }

      const response = await fetch('/api/accounts/arbitres/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setRawData(data);
      console.log('🔍 Réponse brute du backend:', data);
    } catch (err) {
      console.error('❌ Erreur:', err);
      alert('Erreur lors de la récupération des données');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🔍 Debug CIN</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profil actuel */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📱 Profil Frontend</h2>
            
            {isLoading && <div className="text-center">⏳ Chargement...</div>}
            {error && <div className="text-red-600">❌ Erreur: {error}</div>}
            
            {profile && (
              <div className="space-y-3 text-sm">
                <div><strong>ID:</strong> {profile.id}</div>
                <div><strong>Nom complet:</strong> {profile.full_name || `${profile.first_name} ${profile.last_name}`}</div>
                <div><strong>Prénom:</strong> {profile.first_name}</div>
                <div><strong>Nom:</strong> {profile.last_name}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Téléphone:</strong> {profile.phone_number}</div>
                <div><strong>Grade:</strong> {profile.grade}</div>
                <div><strong>Rôle:</strong> {profile.role}</div>
                <div className="bg-yellow-50 p-3 rounded">
                  <strong>🎯 CIN:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    (profile as any).cin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {(profile as any).cin || 'NULL/UNDEFINED'}
                  </span>
                </div>
                <div><strong>Type CIN:</strong> {typeof (profile as any).cin}</div>
                <div><strong>Valeur CIN:</strong> {JSON.stringify((profile as any).cin)}</div>
              </div>
            )}
          </div>

          {/* Données brutes du backend */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🔧 Données Backend Brutes</h2>
            
            <button 
              onClick={checkBackendResponse}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
            >
              🔍 Vérifier la réponse du backend
            </button>
            
            {rawData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Réponse JSON :</h3>
                <pre className="text-xs overflow-auto max-h-96 bg-white p-3 rounded border">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
                
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <h4 className="font-bold text-blue-800">🔍 Analyse du champ 'cin' :</h4>
                  <div className="text-sm">
                    <div><strong>Présent:</strong> {rawData.cin !== undefined ? '✅ Oui' : '❌ Non'}</div>
                    <div><strong>Valeur:</strong> {rawData.cin || 'null/undefined'}</div>
                    <div><strong>Type:</strong> {typeof rawData.cin}</div>
                    <div><strong>Est null:</strong> {rawData.cin === null ? '✅ Oui' : '❌ Non'}</div>
                    <div><strong>Est undefined:</strong> {rawData.cin === undefined ? '✅ Oui' : '❌ Non'}</div>
                    <div><strong>Est vide:</strong> {rawData.cin === '' ? '✅ Oui' : '❌ Non'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test de la carte CIN */}
        {profile && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🧪 Test Carte CIN</h2>
            
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🆔</span>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-800 text-sm">CIN</h4>
                  <p className="text-cyan-700 font-medium">
                    {(profile as any).cin || 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">📋 Instructions</h2>
          <div className="text-sm space-y-2">
            <p><strong>1.</strong> Cliquez sur "Vérifier la réponse du backend"</p>
            <p><strong>2.</strong> Regardez la valeur du champ "cin" dans la réponse JSON</p>
            <p><strong>3.</strong> Si le CIN est null, la carte affichera "Non renseigné"</p>
            <p><strong>4.</strong> Si le CIN a une valeur, elle s'affichera dans la carte</p>
          </div>
        </div>
      </div>
    </div>
  );
}
