"use client";

import React from 'react';
import { useMatchHistory } from '../../hooks/useMatchHistory';

interface MatchHistoryProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  onBack: () => void;
}



export default function MatchHistory({
  isRtl,
  homeT,
  onBack
}: MatchHistoryProps) {
  const {
    matches,
    isLoading,
    error,
    totalMatches,
    refreshMatches,
    formatMatchDate,
    formatMatchTime,
    getRoleDisplayName,
    getStatusColor,
    getStatusDisplayName
  } = useMatchHistory();

  // Affichage du loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm ${isRtl ? 'font-arabic' : ''}`}
          >
            <span className="text-xs">{isRtl ? '→' : '←'}</span>
            {homeT.back}
          </button>
          
          <h1 className={`text-xl font-bold text-white drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
            {homeT.matchHistory}
          </h1>
          
          <div className="w-16"></div>
        </div>

        <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de l'historique...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm ${isRtl ? 'font-arabic' : ''}`}
          >
            <span className="text-xs">{isRtl ? '→' : '←'}</span>
            {homeT.back}
          </button>
          
          <h1 className={`text-xl font-bold text-white drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
            {homeT.matchHistory}
          </h1>
          
          <div className="w-16"></div>
        </div>

        <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4">Erreur lors du chargement de l'historique</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button
                  onClick={refreshMatches}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mr-2"
                >
                  Réessayer
                </button>
                <button
                  onClick={onBack}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Titre et bouton retour */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm ${isRtl ? 'font-arabic' : ''}`}
        >
          <span className="text-xs">{isRtl ? '→' : '←'}</span>
          {homeT.back}
        </button>
        
        <h1 className={`text-xl font-bold text-white drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
          {homeT.matchHistory}
        </h1>
        
        <div className="w-16"></div> {/* Spacer pour centrer le titre */}
      </div>

      {/* Tableau d'historique */}
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Type
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Catégorie
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Stade
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Date
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Heure
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Équipes
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Score
                  </th>
                  <th className={`py-4 px-3 text-left font-bold text-gray-800 ${isRtl ? 'font-arabic text-right' : ''}`}>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>Aucun match trouvé</p>
                    </td>
                  </tr>
                ) : (
                  matches.map((match, index) => (
                    <tr key={match.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}>
                      <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                        <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          {match.type_match_info ? `${match.type_match_info.nom} (${match.type_match_info.code})` : 'Type inconnu'}
                        </span>
                      </td>
                      <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {match.categorie_info ? `${match.categorie_info.nom} (${match.categorie_info.age_min}-${match.categorie_info.age_max} ans)` : 'Catégorie inconnue'}
                        </span>
                      </td>
                      <td className={`py-4 px-3 text-gray-700 font-medium ${isRtl ? 'font-arabic text-right' : ''}`}>
                        {match.stadium}
                      </td>
                      <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                        {formatMatchDate(match.match_date)}
                      </td>
                      <td className={`py-4 px-3 text-gray-700 font-mono ${isRtl ? 'text-right' : ''}`}>
                        {formatMatchTime(match.match_time)}
                      </td>
                      <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                        <div className="space-y-1">
                          <div className="font-medium text-green-700">{match.home_team}</div>
                          <div className="text-xs text-gray-500">vs</div>
                          <div className="font-medium text-blue-700">{match.away_team}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getRoleDisplayName(match.role)}
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-3 text-center ${isRtl ? 'text-right' : ''}`}>
                        {match.has_score ? (
                          <div className="font-bold text-lg">
                            <span className="text-green-600">{match.home_score}</span>
                            <span className="text-gray-500 mx-1">-</span>
                            <span className="text-blue-600">{match.away_score}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className={`py-4 px-3 ${isRtl ? 'text-right' : ''}`}>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                          {getStatusDisplayName(match.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className={`font-bold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
              Statistiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-2xl text-green-600">
                  {matches.filter(m => m.status === 'completed').length}
                </div>
                <div className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                  Matchs terminés
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-yellow-600">
                  {matches.filter(m => m.status === 'pending').length}
                </div>
                <div className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                  Matchs en attente
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">
                  {totalMatches}
                </div>
                <div className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                  Total
                </div>
              </div>
            </div>
          </div>

          {/* Informations sur le nombre de matchs */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              {totalMatches} match{totalMatches > 1 ? 's' : ''} trouvé{totalMatches > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
      
      {/* Espace supplémentaire pour le scroll */}
      <div className="h-20"></div>
    </div>
  );
}
