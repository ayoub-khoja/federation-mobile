"use client";

import React from 'react';

interface MatchHistoryProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  onBack: () => void;
}

// Données d'exemple pour l'historique
const matchHistoryData = [
  {
    id: 1,
    matchType: "ligue1",
    category: "senior",
    stadium: "Stade Olympique de Radès",
    matchDate: "2025-08-15",
    matchTime: "16:00",
    homeTeam: "Espérance Sportive de Tunis",
    awayTeam: "Club Africain",
    homeScore: "2",
    awayScore: "1",
    description: "Match de championnat important",
    matchSheet: "feuille_match_001.pdf",
    status: "Terminé"
  },
  {
    id: 2,
    matchType: "ligue2",
    category: "senior",
    stadium: "Stade Mustapha Ben Jannet",
    matchDate: "2025-08-20",
    matchTime: "15:30",
    homeTeam: "CS Sfaxien",
    awayTeam: "Étoile du Sahel",
    homeScore: "1",
    awayScore: "1",
    description: "Derby du Sud",
    matchSheet: "feuille_match_002.pdf",
    status: "Terminé"
  },
  {
    id: 3,
    matchType: "c1",
    category: "senior",
    stadium: "Stade Taieb Mhiri",
    matchDate: "2025-08-25",
    matchTime: "18:00",
    homeTeam: "US Monastir",
    awayTeam: "CA Bizertin",
    homeScore: "-",
    awayScore: "-",
    description: "Quart de finale de coupe",
    matchSheet: "-",
    status: "Programmé"
  }
];

const getMatchTypeLabel = (type: string) => {
  const types: {[key: string]: string} = {
    ligue1: "Ligue 1",
    ligue2: "Ligue 2",
    c1: "Coupe de Tunisie",
    c2: "Coupe de la CAF",
    youth: "Jeunes",
    regional: "Régional"
  };
  return types[type] || type;
};

const getCategoryLabel = (category: string) => {
  const categories: {[key: string]: string} = {
    senior: "Senior",
    u21: "U21",
    junior: "Junior",
    cadets: "Cadets",
    minimes: "Minimes",
    school: "École"
  };
  return categories[category] || category;
};

export default function MatchHistory({
  isRtl,
  homeT,
  onBack
}: MatchHistoryProps) {
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
                {matchHistoryData.map((match, index) => (
                  <tr key={match.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                    <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                      <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getMatchTypeLabel(match.matchType)}
                      </span>
                    </td>
                    <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getCategoryLabel(match.category)}
                      </span>
                    </td>
                    <td className={`py-4 px-3 text-gray-700 font-medium ${isRtl ? 'font-arabic text-right' : ''}`}>
                      {match.stadium}
                    </td>
                    <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                      {new Date(match.matchDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className={`py-4 px-3 text-gray-700 font-mono ${isRtl ? 'text-right' : ''}`}>
                      {match.matchTime}
                    </td>
                    <td className={`py-4 px-3 text-gray-700 ${isRtl ? 'font-arabic text-right' : ''}`}>
                      <div className="space-y-1">
                        <div className="font-medium text-green-700">{match.homeTeam}</div>
                        <div className="text-xs text-gray-500">vs</div>
                        <div className="font-medium text-blue-700">{match.awayTeam}</div>
                      </div>
                    </td>
                    <td className={`py-4 px-3 text-center ${isRtl ? 'text-right' : ''}`}>
                      {match.homeScore !== '-' ? (
                        <div className="font-bold text-lg">
                          <span className="text-green-600">{match.homeScore}</span>
                          <span className="text-gray-500 mx-1">-</span>
                          <span className="text-blue-600">{match.awayScore}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className={`py-4 px-3 ${isRtl ? 'text-right' : ''}`}>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        match.status === 'Terminé' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
                  {matchHistoryData.filter(m => m.status === 'Terminé').length}
                </div>
                <div className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                  Matchs arbitrés
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-yellow-600">
                  {matchHistoryData.filter(m => m.status === 'Programmé').length}
                </div>
                <div className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                  Matchs programmés
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">
                  {matchHistoryData.length}
                </div>
                <div className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Espace supplémentaire pour le scroll */}
      <div className="h-20"></div>
    </div>
  );
}
