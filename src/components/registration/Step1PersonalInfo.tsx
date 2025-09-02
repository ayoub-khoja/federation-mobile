"use client";

import React from 'react';
import { PersonalInfo } from '../../hooks/useRegistration';
import Image from 'next/image';

interface Step1PersonalInfoProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
  errors: {[key: string]: string};
  phoneVerification?: {
    isVerifying: boolean;
    isVerified: boolean;
    message: string;
    exists: boolean;
  };
  isRtl?: boolean;
}

export default function Step1PersonalInfo({ 
  data, 
  onChange, 
  errors, 
  phoneVerification,
  isRtl = false 
}: Step1PersonalInfoProps) {
  
  const handlePhoneChange = (value: string) => {
    // Auto-formater le numéro de téléphone
    let formattedValue = value.replace(/\D/g, ''); // Supprimer tous les non-chiffres
    
    if (formattedValue.length > 0 && !formattedValue.startsWith('216')) {
      if (formattedValue.length <= 8) {
        formattedValue = '216' + formattedValue;
      }
    }
    
    if (formattedValue.length > 11) {
      formattedValue = formattedValue.substring(0, 11);
    }
    
    const finalValue = formattedValue.length > 0 ? '+' + formattedValue : '';
    onChange({ phoneNumber: finalValue });
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
          Informations Personnelles
        </h2>
        <p className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
          Commençons par vos informations de base
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {/* Prénom et Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
              Prénom *
            </label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
                errors.firstName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-red-500'
              } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
              placeholder="Votre prénom"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
              Nom *
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
                errors.lastName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-red-500'
              } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
              placeholder="Votre nom"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Numéro de téléphone *
          </label>
          <div className="relative">
            <input
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
                errors.phoneNumber 
                  ? 'border-red-500 focus:border-red-500' 
                  : phoneVerification?.isVerified && !phoneVerification.exists
                  ? 'border-green-500 focus:border-green-500'
                  : phoneVerification?.isVerified && phoneVerification.exists
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-red-500'
              } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
              placeholder="+21612345678"
              dir="ltr"
            />
            
            {/* Indicateur de vérification */}
            {phoneVerification?.isVerifying && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {phoneVerification?.isVerified && !phoneVerification.exists && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-green-500 text-lg">✅</span>
              </div>
            )}
            
            {phoneVerification?.isVerified && phoneVerification.exists && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-red-500 text-lg">❌</span>
              </div>
            )}
          </div>
          
          {/* Messages d'erreur - seulement si pas de vérification positive */}
          {errors.phoneNumber && !(phoneVerification?.isVerified && !phoneVerification.exists) && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
          
          {/* Messages de vérification */}
          {phoneVerification?.isVerified && phoneVerification.message && (
            <p className={`text-sm mt-1 ${
              phoneVerification.exists 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {phoneVerification.exists ? '❌' : '✅'} {phoneVerification.message}
            </p>
          )}
          
          {phoneVerification?.isVerifying && (
            <p className="text-blue-600 text-sm mt-1">
              🔄 Vérification du numéro en cours...
            </p>
          )}
          
          <p className="text-gray-500 text-xs mt-1">
            Format: +216XXXXXXXX (numéro tunisien)
          </p>
        </div>

        {/* Email */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Adresse email *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
            placeholder="votre.email@exemple.com"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Adresse complète *
          </label>
          <textarea
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            rows={3}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 resize-none ${
              errors.address 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-red-500'
            } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
            placeholder="Votre adresse complète (rue, ville, code postal)"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      {/* Section Photo de Profil */}
      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-6">
          <label className={`block text-sm font-medium text-gray-700 mb-4 ${isRtl ? 'font-arabic' : ''}`}>
            Photo de profil (optionnelle)
          </label>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Aperçu de la photo */}
            <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {data.profilePhoto ? (
                <Image 
                  src={typeof data.profilePhoto === 'string' ? data.profilePhoto : URL.createObjectURL(data.profilePhoto)}
                  alt="Aperçu"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-400 text-2xl">📷</span>
              )}
            </div>
            
            {/* Bouton de téléchargement */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange({ profilePhoto: file });
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="profile-photo"
              />
              <label
                htmlFor="profile-photo"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="mr-2">📸</span>
                {data.profilePhoto ? 'Changer la photo' : 'Ajouter une photo'}
              </label>
            </div>
            
            {/* Bouton supprimer si photo sélectionnée */}
            {data.profilePhoto && (
              <button
                type="button"
                onClick={() => onChange({ profilePhoto: undefined })}
                className="text-red-600 text-sm hover:text-red-800 transition-colors"
              >
                Supprimer la photo
              </button>
            )}
          </div>
          
          <p className="text-gray-500 text-xs text-center mt-2">
            JPG, PNG ou GIF jusqu&apos;à 5MB. Recommandé : 300x300px
          </p>
        </div>
      </div>
    </div>
  );
}

