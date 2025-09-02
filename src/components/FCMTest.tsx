'use client';

import { useFCMNotifications } from '../hooks/useFCMNotifications';
import { useState } from 'react';

export default function FCMTest() {
  const { 
    isSupported, 
    isSubscribed, 
    isSubscribing, 
    error, 
    token,
    subscribe, 
    unsubscribe, 
    toggle,
    clearError 
  } = useFCMNotifications();

  const [testResult, setTestResult] = useState<string>('');

  const testFCMStatus = async () => {
    try {
      const response = await fetch('/api/accounts/fcm/status/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Erreur: ${error}`);
    }
  };

  const testFCMNotification = async () => {
    try {
      const response = await fetch('/api/accounts/fcm/test/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      
      // Si le backend n'est pas disponible, envoyer une notification manuelle
      if (data.instruction && data.instruction.includes('notification manuelle')) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🧪 Test FCM Frontend', {
            body: 'Notification de test envoyée depuis le frontend',
            icon: '/icon-192x192.png',
            tag: 'fcm-test-frontend'
          });
          data.frontend_notification_sent = true;
        }
      }
      
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Erreur: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🧪 Test FCM</h2>
      
      {/* État FCM */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">État FCM :</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Supporté:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isSupported ? '✅ Oui' : '❌ Non'}
            </span>
          </p>
          <p><span className="font-medium">Abonné:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {isSubscribed ? '✅ Oui' : '❌ Non'}
            </span>
          </p>
          <p><span className="font-medium">Token:</span> 
            <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {token ? `${token.substring(0, 20)}...` : 'Aucun'}
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 space-y-3">
        <button
          onClick={toggle}
          disabled={!isSupported || isSubscribing}
          className={`w-full py-2 px-4 rounded font-medium ${
            isSubscribing 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isSubscribed
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isSubscribing ? '⏳ En cours...' : isSubscribed ? '🔕 Se désabonner' : '🔔 S\'abonner'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={testFCMStatus}
            className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded font-medium"
          >
            📊 Statut
          </button>
          <button
            onClick={testFCMNotification}
            className="py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium"
          >
            🧪 Test Notification
          </button>
        </div>
      </div>

      {/* Erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-red-800 text-sm">
            <strong>Erreur:</strong> {error}
          </p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Effacer l'erreur
          </button>
        </div>
      )}

      {/* Résultats des tests */}
      {testResult && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Résultat du test :</h3>
          <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-40">
            {testResult}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-800">📋 Instructions de test :</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Vérifiez que "Supporté" est ✅</li>
          <li>2. Cliquez sur "S'abonner" pour obtenir un token FCM</li>
          <li>3. Autorisez les notifications dans votre navigateur</li>
          <li>4. Cliquez sur "Statut" pour vérifier l'état côté backend</li>
          <li>5. Cliquez sur "Test Notification" pour envoyer une notification</li>
        </ol>
      </div>
    </div>
  );
}

