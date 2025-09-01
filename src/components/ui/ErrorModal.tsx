"use client";

import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  errors?: Record<string, string | string[]>;
}

export default function ErrorModal({
  isOpen,
  onClose,
  title = "Erreur lors de l'inscription",
  message,
  buttonText = "Réessayer",
  errors
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeInUp">
        
        {/* Header */}
        <div className="bg-red-50 p-6 text-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-center mb-4 leading-relaxed">
            {message}
          </p>

          {/* Affichage des erreurs détaillées si disponibles */}
          {errors && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2 text-sm">Détails de l&apos;erreur :</h4>
              <div className="space-y-1">
                {Object.entries(errors).map(([field, fieldErrors]) => (
                  <div key={field} className="text-sm">
                    <span className="font-medium text-red-700 capitalize">
                      {field.replace('_', ' ')}:
                    </span>
                    <div className="ml-2 text-red-600">
                      {Array.isArray(fieldErrors) 
                        ? fieldErrors.map((error, index) => (
                            <div key={index}>• {error}</div>
                          ))
                        : <div>• {fieldErrors}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


