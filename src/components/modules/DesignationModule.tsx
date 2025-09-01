"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DesignationModuleProps {
  isRtl: boolean;
  homeT: { [key: string]: string };
}

interface Designation {
  id: number;
  arbitre_name: string;
  type_designation_display: string;
  status_display: string;
  date_designation: string;
  notification_envoyee: boolean;
  match_summary: string;
}

export default function DesignationModule({ isRtl }: DesignationModuleProps) {
  const router = useRouter();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDesignations();
  }, []);

  const loadDesignations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/matches/designations/my/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDesignations(data.designations || []);
      } else {
        console.error('Erreur lors du chargement des désignations');
      }
    } catch (error) {
      console.error('Erreur de chargement des désignations:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleViewAllDesignations = () => {
    router.push('/designations');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h1 className={`text-3xl font-bold text-white mb-1 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
            Mes Désignations
          </h1>
          <div className="w-16 h-0.5 bg-white/50 mx-auto rounded-full"></div>
        </div>
        
        <div className="glass rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-2">Chargement des désignations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Titre de la section */}
      <div className="text-center mb-4">
        <h1 className={`text-3xl font-bold text-white mb-1 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
          Mes Désignations
        </h1>
        <div className="w-16 h-0.5 bg-white/50 mx-auto rounded-full"></div>
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{designations.length}</div>
          <div className="text-white/80 text-sm">Total</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {designations.filter(d => d.status_display === 'Acceptée').length}
          </div>
          <div className="text-white/80 text-sm">Acceptées</div>
        </div>
      </div>

      {/* Liste des désignations récentes */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold text-white ${isRtl ? 'font-arabic' : ''}`}>
            Désignations Récentes
          </h2>
          <button
            onClick={handleViewAllDesignations}
            className="text-white/80 hover:text-white text-sm underline"
          >
            Voir tout
          </button>
        </div>
        
        {designations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-white/80 mb-2">Aucune désignation pour le moment</p>
                         <p className="text-white/60 text-sm">
               Consultez vos désignations d&apos;arbitrage
             </p>
          </div>
        ) : (
          <div className="space-y-3">
            {designations.slice(0, 3).map((designation) => (
              <div key={designation.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(designation.status_display)}`}>
                        {designation.status_display}
                      </span>

                    </div>
                    
                    <h3 className="text-white font-medium mb-1">
                      {designation.type_designation_display}
                    </h3>
                    
                    <p className="text-white/80 text-sm mb-2">
                      {designation.match_summary}
                    </p>
                    
                    <p className="text-white/60 text-xs">
                      {new Date(designation.date_designation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {designations.length > 3 && (
              <div className="text-center pt-2">
                <button
                  onClick={handleViewAllDesignations}
                  className="text-white/80 hover:text-white text-sm underline"
                >
                  Voir les {designations.length - 3} autres désignations
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="glass rounded-2xl p-6">
        <h2 className={`text-xl font-bold text-white mb-4 ${isRtl ? 'font-arabic' : ''}`}>
          Actions Rapides
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleViewAllDesignations}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>Voir toutes mes désignations</span>
          </button>
        </div>
      </div>
    </div>
  );
}

