"use client";

import React from 'react';
import { ProfessionalInfo, GRADES, ROLES } from '../../hooks/useRegistration';
import { useLigues } from '../../hooks/useLigues';

interface Step2ProfessionalInfoProps {
  data: ProfessionalInfo;
  onChangeAction: (data: Partial<ProfessionalInfo>) => void;
  errors: {[key: string]: string};
  isRtl?: boolean;
}

export default function Step2ProfessionalInfo({ 
  data, 
  onChangeAction, 
  errors, 
  isRtl = false 
}: Step2ProfessionalInfoProps) {
  const { ligues, loading: liguesLoading, error: liguesError, refetch } = useLigues();

  // Créer les options pour le select - seulement les ligues actives
  const liguesOptions = ligues
    .filter(ligue => ligue.is_active) // Filtrer seulement les ligues actives
    .sort((a, b) => a.ordre - b.ordre) // Trier par ordre
    .map(ligue => ({
      value: ligue.id.toString(),
      label: `${ligue.nom}${ligue.description ? ` - ${ligue.description}` : ''}`
    }));

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">⚽</span>
        </div>
        <h2 className={`text-2xl font-bold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
          Informations Professionnelles
        </h2>
        <p className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
          Définissez votre niveau d&apos;arbitrage
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-6">
        {/* Rôle */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Rôle *
          </label>
          <select
            value={data.role}
            onChange={(e) => onChangeAction({ role: e.target.value })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 bg-white ${
              errors.role 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">Sélectionnez votre rôle</option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-2">{errors.role}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Choisissez votre rôle dans l&apos;arbitrage
          </p>
        </div>

        {/* Ligue d'Arbitrage */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Ligue d&apos;arbitrage *
          </label>
          
          {liguesError && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              <div className="flex items-center justify-between">
                <span>⚠️ Erreur de chargement des ligues: {liguesError}</span>
                <button
                  onClick={refetch}
                  className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}
          
          <select
            value={data.ligueCode}
            onChange={(e) => onChangeAction({ ligueCode: e.target.value })}
            disabled={liguesLoading || !!liguesError}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 bg-white ${
              errors.ligueCode 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'} ${
              (liguesLoading || !!liguesError) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">
              {liguesLoading 
                ? 'Chargement des ligues...' 
                : liguesError 
                ? 'Erreur de chargement'
                : liguesOptions.length === 0
                ? 'Aucune ligue disponible'
                : 'Sélectionnez votre ligue'
              }
            </option>
            {liguesOptions.map((ligue) => (
              <option key={ligue.value} value={ligue.value}>
                {ligue.label}
              </option>
            ))}
          </select>
          
          {errors.ligueCode && (
            <p className="text-red-500 text-sm mt-2">{errors.ligueCode}</p>
          )}
          
          <p className="text-gray-500 text-xs mt-1">
            Sélectionnez la ligue d&apos;arbitrage de votre région
          </p>
        </div>

        {/* Grade */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Grade d&apos;arbitrage *
          </label>
          <select
            value={data.grade}
            onChange={(e) => onChangeAction({ grade: e.target.value })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 bg-white ${
              errors.grade 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">Sélectionnez votre grade</option>
            {GRADES.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
          {errors.grade && (
            <p className="text-red-500 text-sm mt-2">{errors.grade}</p>
          )}
        </div>

        {/* Date de naissance */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Date de naissance *
          </label>
          <input
            type="date"
            value={data.dateNaissance}
            onChange={(e) => onChangeAction({ dateNaissance: e.target.value })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
              errors.dateNaissance 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
            dir="ltr"
          />
          {errors.dateNaissance && (
            <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>
          )}
        </div>

        {/* Lieu de naissance */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Lieu de naissance *
          </label>
          <input
            type="text"
            value={data.lieuNaissance}
            onChange={(e) => onChangeAction({ lieuNaissance: e.target.value })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
              errors.lieuNaissance 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
            placeholder="Ville ou lieu de naissance"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
          {errors.lieuNaissance && (
            <p className="text-red-500 text-sm mt-1">{errors.lieuNaissance}</p>
          )}
        </div>
      </div>


    </div>
  );
}
