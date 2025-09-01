import { useState, useEffect, useCallback } from 'react';
import { NEXT_PUBLIC_VAPID_PUBLIC_KEY } from '../config/environment';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  isSubscribing: boolean;
  error: string | null;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    isSubscribing: false,
    error: null
  });

  useEffect(() => {
    // Vérifier si les notifications push sont supportées
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setState(prev => ({ ...prev, isSupported: true }));
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        setState(prev => ({ ...prev, isSubscribed: true }));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!state.isSupported) return;

    setState(prev => ({ ...prev, isSubscribing: true, error: null }));

    try {
      // Demander la permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission refusée pour les notifications');
      }

      // Enregistrer le service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Créer l'abonnement push
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(NEXT_PUBLIC_VAPID_PUBLIC_KEY)
      });

      // Envoyer l'abonnement au serveur
      const response = await fetch('/api/notifications/push/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          endpoint: pushSubscription.endpoint,
          p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
        })
      });

      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          isSubscribed: true, 
          isSubscribing: false 
        }));
        console.log('✅ Abonnement aux notifications push réussi');
      } else {
        throw new Error('Erreur lors de l\'enregistrement de l\'abonnement');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isSubscribing: false 
      }));
      console.error('❌ Erreur lors de l\'abonnement:', error);
    }
  }, [state.isSupported]);

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Se désabonner côté client
        await subscription.unsubscribe();

        // Informer le serveur
        await fetch('/api/notifications/push/unsubscribe/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });

        setState(prev => ({ ...prev, isSubscribed: false }));
        console.log('✅ Désabonnement des notifications push réussi');
      }
    } catch (error) {
      console.error('❌ Erreur lors du désabonnement:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors du désabonnement' 
      }));
    }
  }, []);

  const toggle = useCallback(async () => {
    if (state.isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  }, [state.isSubscribed, subscribe, unsubscribe]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fonctions utilitaires pour la conversion des clés
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return {
    ...state,
    subscribe,
    unsubscribe,
    toggle,
    clearError
  };
};
