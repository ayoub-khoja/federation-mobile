"use client";

import React from 'react';

interface MatchFormProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  matchForm: {
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
  };
  onFormInputChange: (field: string, value: string) => void;
  onFileUpload: (file: File | null) => void;
  onSubmitMatch: (e: React.FormEvent) => void;
  onCancelForm: () => void;
}

export default function MatchForm({
  isRtl,
  homeT,
  matchForm,
  onFormInputChange,
  onFileUpload,
  onSubmitMatch,
  onCancelForm
}: MatchFormProps) {
  return (
    <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold text-red-600 ${isRtl ? 'font-arabic' : ''}`}>
            {homeT.matchForm}
          </h2>
          <button
            onClick={onCancelForm}
            className="text-gray-500 hover:text-red-500 transition-colors p-2"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100 pr-2">
          <form onSubmit={onSubmitMatch} className="space-y-4">
              
            {/* Type de match */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.matchType}
                </label>
                <select
                  value={matchForm.matchType}
                  onChange={(e) => onFormInputChange('matchType', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="ligue1">{homeT.ligue1}</option>
                  <option value="ligue2">{homeT.ligue2}</option>
                  <option value="c1">{homeT.c1}</option>
                  <option value="c2">{homeT.c2}</option>
                  <option value="youth">{homeT.youth}</option>
                  <option value="regional">{homeT.regional}</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.category}
                </label>
                <select
                  value={matchForm.category}
                  onChange={(e) => onFormInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="senior">{homeT.senior}</option>
                  <option value="u21">{homeT.u21}</option>
                  <option value="junior">{homeT.junior}</option>
                  <option value="cadets">{homeT.cadets}</option>
                  <option value="minimes">{homeT.minimes}</option>
                  <option value="school">{homeT.school}</option>
                </select>
              </div>
            </div>

            {/* Stade */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                {homeT.stadium}
              </label>
              <input
                type="text"
                value={matchForm.stadium}
                onChange={(e) => onFormInputChange('stadium', e.target.value)}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                placeholder="Nom du stade"
                required
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.matchDate}
                </label>
                <input
                  type="date"
                  value={matchForm.matchDate}
                  onChange={(e) => onFormInputChange('matchDate', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.matchTime}
                </label>
                <input
                  type="time"
                  value={matchForm.matchTime}
                  onChange={(e) => onFormInputChange('matchTime', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  required
                />
              </div>
            </div>

            {/* Équipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.homeTeam}
                </label>
                <input
                  type="text"
                  value={matchForm.homeTeam}
                  onChange={(e) => onFormInputChange('homeTeam', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  placeholder="Nom de l'équipe domicile"
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.awayTeam}
                </label>
                <input
                  type="text"
                  value={matchForm.awayTeam}
                  onChange={(e) => onFormInputChange('awayTeam', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  placeholder="Nom de l'équipe visiteur"
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            {/* Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.homeScore}
                </label>
                <input
                  type="number"
                  min="0"
                  value={matchForm.homeScore}
                  onChange={(e) => onFormInputChange('homeScore', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {homeT.awayScore}
                </label>
                <input
                  type="number"
                  min="0"
                  value={matchForm.awayScore}
                  onChange={(e) => onFormInputChange('awayScore', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                {homeT.description}
              </label>
              <textarea
                value={matchForm.description}
                onChange={(e) => onFormInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 resize-none ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                placeholder="Description du match (optionnel)"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Upload feuille de match */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                {homeT.matchSheet}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload(e.target.files?.[0] || null)}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
              />
              <p className={`text-xs text-gray-500 mt-1 ${isRtl ? 'font-arabic' : ''}`}>
                Formats acceptés: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className={`flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 ${isRtl ? 'font-arabic' : ''}`}
              >
                {homeT.saveMatch}
              </button>
              <button
                type="button"
                onClick={onCancelForm}
                className={`flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 ${isRtl ? 'font-arabic' : ''}`}
              >
                {homeT.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Espace supplémentaire pour permettre le scroll jusqu'en bas */}
      <div className="h-60"></div>
    </div>
  );
}
