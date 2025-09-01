"use client";

import React from 'react';
import MatchForm from './MatchForm';
import MatchHistory from './MatchHistory';

interface MatchFormData {
  matchType: string;
  category: string;
  stadium: string;
  matchDate: string;
  matchTime: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  description: string;
  matchSheet: File | null;
}

interface MatchModuleProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  showAddMatchForm: boolean;
  showMatchHistory: boolean;
  onAddMatchClick: () => void;
  onHistoryClick: () => void;
  onCancelForm: () => void;
  matchForm: MatchFormData;
  onFormInputChange: (field: string, value: string) => void;
  onFileUpload: (file: File | null) => void;
  onSubmitMatch: (e: React.FormEvent) => void;
}

export default function MatchModule({
  isRtl,
  homeT,
  showAddMatchForm,
  showMatchHistory,
  onAddMatchClick,
  onHistoryClick,
  onCancelForm,
  matchForm,
  onFormInputChange,
  onFileUpload,
  onSubmitMatch
}: MatchModuleProps) {
  
  if (showAddMatchForm) {
    return (
      <MatchForm
        isRtl={isRtl}
        homeT={homeT}
        matchForm={matchForm}
        onFormInputChange={onFormInputChange}
        onFileUpload={onFileUpload}
        onSubmitMatch={onSubmitMatch}
        onCancelForm={onCancelForm}
      />
    );
  }

  if (showMatchHistory) {
    return (
      <MatchHistory
        isRtl={isRtl}
        homeT={homeT}
        onBack={onCancelForm}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Titre de la section */}
      <div className="text-center mb-4">
        <h1 className={`text-3xl font-bold text-white mb-1 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
          {homeT.matches}
        </h1>
        <div className="w-16 h-0.5 bg-white/50 mx-auto rounded-full"></div>
      </div>
      
      {/* Boutons d'action pour les matchs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Ajouter un match */}
        <div 
          onClick={onAddMatchClick}
          className="glass rounded-2xl shadow-ftf overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fadeInUp"
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-all duration-300 group-hover:scale-105">
              <span className="text-green-600 text-2xl">➕</span>
            </div>
            <h3 className={`text-xl font-bold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
              {homeT.addMatch}
            </h3>
            <p className={`text-gray-600 text-xs leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
              Programmer un nouveau match
            </p>
          </div>
        </div>

        {/* Historique des matchs */}
        <div 
          onClick={onHistoryClick}
          className="glass rounded-2xl shadow-ftf overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fadeInUp"
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-105">
              <span className="text-blue-600 text-2xl">📋</span>
            </div>
            <h3 className={`text-xl font-bold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
              {homeT.matchHistory}
            </h3>
            <p className={`text-gray-600 text-xs leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
              Consulter l&apos;historique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
