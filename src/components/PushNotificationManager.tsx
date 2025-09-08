"use client";

import React from 'react';
import { useFCMNotifications } from '../hooks/useFCMNotifications';

interface PushNotificationManagerProps {
  userId: number;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  userId,
  isEnabled,
  onToggle
}) => {
  const {
    isSupported,
    isSubscribed,
    isSubscribing,
    error,
    toggle,
    clearError
  } = useFCMNotifications();

  // Synchroniser l'état local avec le hook
  React.useEffect(() => {
    onToggle(isSubscribed);
  }, [isSubscribed, onToggle]);

  const handleToggle = async () => {
    await toggle();
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Les notifications push ne sont pas supportées</p>
            <p className="text-xs mt-1">
              Votre navigateur ne supporte pas les notifications push ou Firebase n'est pas correctement configuré.
            </p>
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer font-medium">Détails techniques</summary>
              <div className="mt-1 space-y-1">
                <p>• Service Worker: {typeof window !== 'undefined' && 'serviceWorker' in navigator ? '✅' : '❌'}</p>
                <p>• Push Manager: {typeof window !== 'undefined' && (
                  'PushManager' in window || 
                  ('serviceWorker' in navigator && 'PushManager' in ServiceWorkerRegistration.prototype)
                ) ? '✅' : '❌'}</p>
                <p>• Notifications: {typeof window !== 'undefined' && 'Notification' in window ? '✅' : '❌'}</p>
                <p>• Contexte sécurisé: {typeof window !== 'undefined' && window.isSecureContext ? '✅' : '❌'}</p>
                <p>• Hostname: {typeof window !== 'undefined' ? window.location.hostname : '❌'}</p>
                <p>• Appareil mobile: {typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? '✅' : '❌'}</p>
                <p>• Firebase: {typeof window !== 'undefined' ? 'Vérification...' : '❌'}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        🔔 Notifications Push
      </h3>
      
      <div className="space-y-4">
        {/* Statut actuel */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Statut des notifications</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isEnabled ? 'Activées' : 'Désactivées'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600">
          Recevez des notifications instantanées pour vos désignations d&apos;arbitrage, 
          mises à jour de matchs et autres informations importantes.
        </p>

        {/* Bouton d'action */}
        <button
          onClick={handleToggle}
          disabled={isSubscribing}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isEnabled
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
        >
          {isSubscribing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEnabled ? 'Désactivation...' : 'Activation...'}
            </>
          ) : (
            <>
              {isEnabled ? '🔕 Désactiver les notifications' : '🔔 Activer les notifications'}
            </>
          )}
        </button>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Comment ça marche ?</p>
              <p className="mt-1">
                Une fois activées, vous recevrez des notifications instantanées 
                sur votre appareil pour toutes vos désignations d&apos;arbitrage.
              </p>
            </div>
          </div>
        </div>
        

      </div>
    </div>
  );
};
