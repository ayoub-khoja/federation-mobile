"use client";

import React, { useState } from 'react';
import { SecurityInfo } from '../../hooks/useRegistration';

interface Step3SecurityInfoProps {
  data: SecurityInfo;
  onChange: (data: Partial<SecurityInfo>) => void;
  errors: {[key: string]: string};
  isRtl?: boolean;
}

export default function Step3SecurityInfo({ 
  data, 
  onChange, 
  errors, 
  isRtl = false 
}: Step3SecurityInfoProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation en temps réel de la force du mot de passe
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) return { level: 'Faible', color: 'red', width: '20%' };
    if (score < 4) return { level: 'Moyen', color: 'yellow', width: '60%' };
    return { level: 'Fort', color: 'green', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(data.password);

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
          Sécurité du compte
        </h2>
        <p className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
          Définissez un mot de passe sécurisé pour votre compte
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-6">
        {/* Mot de passe */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-500'
              } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
              placeholder="Votre mot de passe"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Barre de force du mot de passe */}
          {data.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Force du mot de passe:</span>
                <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                  {passwordStrength.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                  style={{ width: passwordStrength.width }}
                ></div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirmation du mot de passe */}
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
            Confirmer le mot de passe *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-colors text-gray-700 ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500' 
                  : data.confirmPassword && data.password === data.confirmPassword
                  ? 'border-green-500 focus:border-green-500'
                  : 'border-gray-200 focus:border-purple-500'
              } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
              placeholder="Confirmez votre mot de passe"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>

            {/* Indicateur de correspondance */}
            {data.confirmPassword && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                {data.password === data.confirmPassword ? (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
          
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>


    </div>
  );
}
