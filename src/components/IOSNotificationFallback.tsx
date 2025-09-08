"use client";

import React, { useState, useEffect } from 'react';

interface IOSNotificationFallbackProps {
  onNotificationRequestAction: () => void;
}

export const IOSNotificationFallback: React.FC<IOSNotificationFallbackProps> = ({ onNotificationRequestAction }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(userAgent);
    const safari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    const chromeIOS = /CriOS/i.test(userAgent) || (/Chrome/i.test(userAgent) && ios);
    const firefoxIOS = /FxiOS/i.test(userAgent) || (/Firefox/i.test(userAgent) && ios);
    
    setIsIOS(ios);
    setIsSafari(safari);
    
    // Afficher le fallback si iOS et pas de support notifications
    if (ios && !('Notification' in window)) {
      setShowFallback(true);
    }
  }, []);

  const handleRequestNotification = async () => {
    try {
      // Essayer d'activer les notifications même sur iOS Safari
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Marquer comme PWA installée pour la détection
          localStorage.setItem('pwa_installed', 'true');
          onNotificationRequestAction();
        } else {
          alert('Notifications refusées. Veuillez les activer dans les paramètres Safari.');
        }
      } else {
        // Fallback : rediriger vers Chrome ou Firefox
        const userAgent = navigator.userAgent;
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
          alert('Pour recevoir des notifications, veuillez utiliser Chrome ou Firefox sur iOS.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la demande de notifications:', error);
      alert('Erreur lors de l\'activation des notifications.');
    }
  };

  if (!showFallback) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            🔔 Notifications sur iOS
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p className="mb-2">
              iOS a des limitations pour les notifications push. Voici vos options :
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRequestNotification}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Essayer d'activer
                </button>
                <span className="text-xs">Tentative d'activation des notifications</span>
              </div>
              <div className="text-xs text-blue-600">
                <p>• <strong>Option 1 :</strong> Ajoutez l'app à l'écran d'accueil (mode PWA) - RECOMMANDÉ</p>
                <p>• <strong>Option 2 :</strong> Utilisez Chrome ou Firefox sur iOS</p>
                <p>• <strong>Option 3 :</strong> Activez les notifications dans Réglages &gt; Safari &gt; Notifications</p>
                <p className="mt-2 text-yellow-600">⚠️ <strong>Important :</strong> Même Chrome/Firefox sur iOS ont des limitations. Le mode PWA est la meilleure solution.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
