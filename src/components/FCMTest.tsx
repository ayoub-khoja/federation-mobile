"use client";

import React, { useState, useEffect } from 'react';
import { useFCMNotifications } from '../hooks/useFCMNotifications';
import { getFCMToken } from '../config/firebase';

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

  useEffect(() => {
    // Collecter les informations de débogage
    const info = {
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notification: 'Notification' in window,
      localStorage: typeof Storage !== 'undefined',
      fcmToken: localStorage.getItem('fcm_token'),
      notificationPermission: Notification.permission
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
    </div>
  );
};