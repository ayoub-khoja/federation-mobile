/**
 * Composant d'alerte d'authentification
 */

import React from 'react';

interface AuthenticationAlertProps {
  onReconnect: () => void;
  onClose: () => void;
  className?: string;
}

export const AuthenticationAlert: React.FC<AuthenticationAlertProps> = ({
  onReconnect,
  onClose,
  className = ''
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-red-800">
            🔑 Session expirée
          </h4>
          <p className="mt-1 text-sm text-red-700">
            Votre session a expiré et ne peut pas être renouvelée automatiquement. 
                         Cliquez sur &quot;Se reconnecter&quot; pour vous authentifier à nouveau.
          </p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={onReconnect}
              className="inline-flex justify-center items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              🔄 Se reconnecter
            </button>
            <button
              onClick={onClose}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
