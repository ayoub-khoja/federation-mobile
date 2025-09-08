"use client";

import React, { useState, useEffect } from 'react';
import { useFCMNotifications } from '../hooks/useFCMNotifications';
import { getFCMToken } from '../config/firebase';
import { PWAInstallGuide } from './PWAInstallGuide';

export const FCMTest: React.FC = () => {
  const {
    isSupported,
    isSubscribed,
    isSubscribing,
    error,
    token,
    subscribe,
    unsubscribe,
    clearError
  } = useFCMNotifications();

  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testMessage, setTestMessage] = useState('');
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return;
    
    // Collecter les informations de débogage
    const info = {
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notification: 'Notification' in window,
      localStorage: typeof Storage !== 'undefined',
      fcmToken: localStorage.getItem('fcm_token'),
      notificationPermission: 'Notification' in window ? Notification.permission : 'unknown'
    };
    setDebugInfo(info);
  }, []);

  const handleTestNotification = async () => {
    if (!isSubscribed || !token) {
      alert('Veuillez d\'abord vous abonner aux notifications');
      return;
    }

    try {
      const response = await fetch('/api/notifications/fcm/test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          fcm_token: token,
          title: 'Test de notification',
          body: testMessage || 'Ceci est un test de notification FCM'
        })
      });

      if (response.ok) {
        alert('Notification de test envoyée !');
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors du test:', error);
      alert('Erreur lors de l\'envoi du test');
    }
  };

  const handleGetToken = async () => {
    try {
      const token = await getFCMToken();
      if (token) {
        alert(`Token FCM: ${token}`);
      } else {
        alert('Impossible d\'obtenir le token FCM');
      }
    } catch (error) {
      console.error('Erreur lors de l\'obtention du token:', error);
      alert('Erreur lors de l\'obtention du token');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Test des Notifications FCM</h1>
      
      {/* Diagnostic mobile simplifié */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📱 Diagnostic Mobile FCM
        </h2>
        
        <div className="space-y-4">
          {/* Informations de base */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Informations de l'appareil</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Appareil:</strong> {typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'}</p>
              <p><strong>Mode PWA:</strong> {typeof window !== 'undefined' && (
                window.matchMedia('(display-mode: standalone)').matches || 
                (window.navigator as any).standalone === true ||
                document.referrer.includes('android-app://')
              ) ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'Inconnu'}</p>
              <p><strong>Contexte sécurisé:</strong> {typeof window !== 'undefined' && window.isSecureContext ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'Inconnu'}</p>
            </div>
          </div>

          {/* Vérifications techniques */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Vérifications techniques</h4>
            <div className="space-y-1 text-sm">
              <p className="flex items-center">
                <span className="mr-2">{typeof window !== 'undefined' && 'serviceWorker' in navigator ? '✅' : '❌'}</span>
                <span>Service Worker</span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">{typeof window !== 'undefined' && (
                  'PushManager' in window || 
                  ('serviceWorker' in navigator && 'PushManager' in ServiceWorkerRegistration.prototype)
                ) ? '✅' : '❌'}</span>
                <span>Push Manager</span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">{typeof window !== 'undefined' && 'Notification' in window ? '✅' : '❌'}</span>
                <span>Notifications</span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">{typeof window !== 'undefined' && window.isSecureContext ? '✅' : '❌'}</span>
                <span>Contexte sécurisé (HTTPS)</span>
              </p>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Recommandations</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent) && (
                <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mb-2">
                  <p className="font-medium text-yellow-800">⚠️ iOS Safari détecté</p>
                  <p className="text-yellow-700">Pour recevoir des notifications sur iOS :</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Option 1 (PWA) :</strong> 
                      <button 
                        onClick={() => setShowInstallGuide(true)}
                        className="text-blue-600 underline ml-1"
                      >
                        Guide d'installation PWA
                      </button>
                    </li>
                    <li><strong>Option 2 (Navigateur) :</strong> Téléchargez Chrome ou Firefox sur l'App Store</li>
                    <li>Activez les notifications dans les paramètres du navigateur</li>
                  </ul>
                </div>
              )}
              {typeof window !== 'undefined' && !('serviceWorker' in navigator) && (
                <p>• Utilisez un navigateur moderne (Chrome, Firefox, Safari, Edge)</p>
              )}
              {typeof window !== 'undefined' && !('PushManager' in window) && !(/iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent)) && (
                <p>• Sur mobile, essayez Chrome ou Firefox récent</p>
              )}
              {typeof window !== 'undefined' && !('Notification' in window) && !(/iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent)) && (
                <p>• Activez les notifications dans les paramètres du navigateur</p>
              )}
              {typeof window !== 'undefined' && !window.isSecureContext && (
                <p>• FCM nécessite HTTPS en production</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informations de débogage */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Informations de débogage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Support FCM:</strong> {isSupported ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Abonné:</strong> {isSubscribed ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Permission:</strong> {debugInfo.notificationPermission}</p>
            <p><strong>Contexte sécurisé:</strong> {debugInfo.isSecureContext ? '✅ Oui' : '❌ Non'}</p>
          </div>
          <div>
            <p><strong>Service Worker:</strong> {debugInfo.serviceWorker ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Push Manager:</strong> {debugInfo.pushManager ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Notifications:</strong> {debugInfo.notification ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Local Storage:</strong> {debugInfo.localStorage ? '✅ Oui' : '❌ Non'}</p>
          </div>
        </div>
        
        {debugInfo.fcmToken && (
          <div className="mt-3">
            <p><strong>Token FCM stocké:</strong></p>
            <p className="text-xs bg-gray-200 p-2 rounded break-all">{debugInfo.fcmToken}</p>
          </div>
        )}
      </div>

      {/* Actions de test */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions de test</h2>
        
        <div className="space-y-4">
          {/* Bouton d'abonnement/désabonnement */}
          <div className="flex gap-2">
            <button
              onClick={isSubscribed ? unsubscribe : subscribe}
              disabled={isSubscribing || !isSupported}
              className={`px-4 py-2 rounded font-medium ${
                isSubscribed
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubscribing ? 'Chargement...' : isSubscribed ? 'Se désabonner' : 'S\'abonner'}
            </button>
            
            <button
              onClick={handleGetToken}
              disabled={!isSupported}
              className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Obtenir le token
            </button>
          </div>

          {/* Test de notification */}
          {isSubscribed && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Message de test:
              </label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Entrez un message de test..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTestNotification}
                className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
              >
                Envoyer notification de test
              </button>
            </div>
          )}
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-800">Erreur:</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Informations sur l'utilisateur */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Informations du navigateur</h3>
        <p className="text-sm text-gray-700 break-all">
          <strong>User Agent:</strong> {debugInfo.userAgent}
        </p>
      </div>

      {/* Guide d'installation PWA */}
      <PWAInstallGuide 
        isVisible={showInstallGuide}
        onCloseAction={() => setShowInstallGuide(false)}
      />
    </div>
  );
};