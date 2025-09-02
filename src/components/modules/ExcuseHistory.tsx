"use client";

import React from 'react';
import { useExcuseHistory } from '../../hooks/useExcuseHistory';

interface ExcuseHistoryProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  onBack: () => void;
}

export default function ExcuseHistory({ isRtl, homeT, onBack }: ExcuseHistoryProps) {
  const {
    excuses,
    isLoading,
    error,
    refreshExcuses,
    formatDate,
    formatDateTime,
    getStatusColor,
    getStatusIcon,
    getPeriodStatus
  } = useExcuseHistory();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className={`text-lg font-medium ${isRtl ? 'font-arabic' : ''}`}>
              Retour
            </span>
          </button>
        </div>

        {/* Titre */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold text-white mb-2 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
            Historique des excuses
          </h1>
          <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
        </div>

        {/* Loading state */}
        <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
              Chargement de l'historique des excuses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className={`text-lg font-medium ${isRtl ? 'font-arabic' : ''}`}>
              Retour
            </span>
          </button>
        </div>

        {/* Titre */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold text-white mb-2 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
            Historique des excuses
          </h1>
          <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
        </div>

        {/* Error state */}
        <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className={`text-red-600 mb-4 ${isRtl ? 'font-arabic' : ''}`}>
              Erreur lors du chargement de l'historique
            </p>
            <p className="text-sm text-red-400 mb-4">{error}</p>
            <button
              onClick={refreshExcuses}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className={`text-lg font-medium ${isRtl ? 'font-arabic' : ''}`}>
            Retour
          </span>
        </button>
        
        <button
          onClick={refreshExcuses}
          className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
        >
          <span className="text-lg">🔄</span>
          <span className={`text-sm ${isRtl ? 'font-arabic' : ''}`}>
            Actualiser
          </span>
        </button>
      </div>

      {/* Titre */}
      <div className="text-center mb-6">
        <h1 className={`text-3xl font-bold text-white mb-2 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
          Historique des excuses
        </h1>
        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-2xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{excuses.length}</div>
            <div className={`text-sm text-white/80 ${isRtl ? 'font-arabic' : ''}`}>
              Total excuses
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {excuses.filter(e => e.status === 'en_attente').length}
            </div>
            <div className={`text-sm text-white/80 ${isRtl ? 'font-arabic' : ''}`}>
              En attente
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {excuses.filter(e => e.status === 'acceptee').length}
            </div>
            <div className={`text-sm text-white/80 ${isRtl ? 'font-arabic' : ''}`}>
              Acceptées
            </div>
          </div>
        </div>
      </div>

      {/* Liste des excuses */}
      {excuses.length === 0 ? (
        <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className={`text-xl font-semibold text-gray-600 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
              Aucune excuse trouvée
            </h3>
            <p className={`text-gray-500 ${isRtl ? 'font-arabic' : ''}`}>
              Vous n'avez pas encore soumis d'excuses.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {excuses.map((excuse) => {
            const periodStatus = getPeriodStatus(excuse);
            
            return (
              <div
                key={excuse.id}
                className="glass rounded-2xl shadow-ftf overflow-hidden hover:shadow-xl transition-all duration-300 animate-fadeInUp"
              >
                <div className="p-6">
                  {/* Header de l'excuse */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(excuse.status)}</span>
                      <div>
                        <div className={`text-lg font-bold text-gray-800 ${isRtl ? 'font-arabic' : ''}`}>
                          Excuse #{excuse.id}
                        </div>
                        <div className={`text-sm text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                          {excuse.arbitre_nom}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(excuse.status)}`}>
                        {excuse.status_display}
                      </span>
                      <div className={`text-xs mt-1 ${periodStatus.color}`}>
                        {periodStatus.text}
                      </div>
                    </div>
                  </div>

                  {/* Période */}
                  <div className="mb-4">
                    <div className={`text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                      Période d'absence
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>Du {formatDate(excuse.date_debut)}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>Au {formatDate(excuse.date_fin)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>({excuse.duree} jour{excuse.duree > 1 ? 's' : ''})</span>
                      </div>
                    </div>
                  </div>

                  {/* Cause */}
                  <div className="mb-4">
                    <div className={`text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                      Motif
                    </div>
                    <p className={`text-sm text-gray-600 leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
                      {excuse.cause}
                    </p>
                  </div>

                  {/* Pièce jointe */}
                  {excuse.piece_jointe && (
                    <div className="mb-4">
                      <div className={`text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                        Pièce jointe
                      </div>
                      <a
                        href={excuse.piece_jointe}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>📎</span>
                        <span className="text-sm">Voir le document</span>
                      </a>
                    </div>
                  )}

                  {/* Commentaire admin */}
                  {excuse.commentaire_admin && (
                    <div className="mb-4">
                      <div className={`text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                        Commentaire administrateur
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className={`text-sm text-blue-800 ${isRtl ? 'font-arabic' : ''}`}>
                          {excuse.commentaire_admin}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions possibles */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <div>Créée le {formatDateTime(excuse.created_at)}</div>
                      {excuse.traite_le && (
                        <div>Traitée le {formatDateTime(excuse.traite_le)}</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {excuse.can_be_modified && (
                        <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                          Modifier
                        </button>
                      )}
                      {excuse.can_be_cancelled && (
                        <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
