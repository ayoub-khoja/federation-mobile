/**
 * Hook pour gérer les notifications Firebase Cloud Messaging (FCM)
 * Remplace usePushNotifications pour utiliser FCM au lieu de VAPID
 */

import { useState, useEffect, useCallback } from 'react';
import { getFCMToken, onFCMessage, isFCMSupported } from '../config/firebase';

interface FCMNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  isSubscribing: boolean;
  error: string | null;
  token: string | null;
}

export const useFCMNotifications = () => {
  const [state, setState] = useState<FCMNotificationState>({
    isSupported: false,
    isSubscribed: false,
    isSubscribing: false,
    error: null,
    token: null
  });

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return;
    
    // Vérifier si FCM est supporté
    const supported = isFCMSupported();
    
    // Détection plus précise pour mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    // Détection PWA améliorée pour iOS
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true ||
                  document.referrer.includes('android-app://') ||
                  // Détection PWA iOS alternative
                  (window.navigator as any).standalone === true ||
                  window.location.search.includes('pwa=true') ||
                  localStorage.getItem('pwa_installed') === 'true';
    const hasPushManager = 'PushManager' in window || 
                          ('serviceWorker' in navigator && 'PushManager' in ServiceWorkerRegistration.prototype);
    
    const debugInfo = {
      supported,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: hasPushManager,
      notification: 'Notification' in window,
      secureContext: window.isSecureContext,
      hostname: window.location.hostname,
      isMobile,
      isPWA,
      userAgent: navigator.userAgent
    };
    
    console.log('🔍 Vérification du support FCM:', debugInfo);
    
    if (supported) {
      setState(prev => ({ ...prev, isSupported: true }));
      checkExistingSubscription();
    } else {
      let errorMessage = 'Firebase Cloud Messaging n\'est pas supporté';
      
      if (!debugInfo.secureContext && !debugInfo.hostname.includes('localhost')) {
        errorMessage = 'FCM nécessite HTTPS en production. Utilisez localhost pour les tests.';
      } else if (!debugInfo.serviceWorker) {
        errorMessage = 'Service Worker non supporté par ce navigateur';
      } else if (!debugInfo.pushManager) {
        if (isIOS && isSafari) {
          errorMessage = 'iOS Safari a des limitations pour les notifications push. Essayez Chrome ou Firefox, ou ajoutez l\'app à l\'écran d\'accueil.';
        } else if (isMobile) {
          errorMessage = 'Push Manager non supporté sur cet appareil mobile. Essayez Chrome ou Firefox récent.';
        } else {
          errorMessage = 'Push Manager non supporté par ce navigateur';
        }
      } else if (!debugInfo.notification) {
        if (isIOS && isSafari) {
          errorMessage = 'iOS Safari a des limitations pour les notifications. Essayez Chrome ou Firefox, ou ajoutez l\'app à l\'écran d\'accueil.';
        } else if (isMobile) {
          errorMessage = 'Notifications non supportées sur cet appareil mobile. Vérifiez les paramètres du navigateur.';
        } else {
          errorMessage = 'Notifications non supportées par ce navigateur';
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        isSupported: false,
        error: errorMessage
      }));
    }
  }, []);

  const checkExistingSubscription = useCallback(async () => {
    try {
      // Vérifier si on a déjà un token FCM stocké
      const storedToken = localStorage.getItem('fcm_token');
      if (storedToken) {
        setState(prev => ({ 
          ...prev, 
          isSubscribed: true, 
          token: storedToken 
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement FCM:', error);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!state.isSupported) return;

    setState(prev => ({ ...prev, isSubscribing: true, error: null }));

    try {
      // Obtenir le token FCM
      const token = await getFCMToken();
      
      if (!token) {
        throw new Error('Impossible d\'obtenir le token FCM');
      }

      // Envoyer le token au serveur
      const response = await fetch('/api/accounts/fcm/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          fcm_token: token,
          user_agent: navigator.userAgent
        })
      });

      if (response.ok) {
        // Stocker le token localement
        localStorage.setItem('fcm_token', token);
        
        setState(prev => ({ 
          ...prev, 
          isSubscribed: true, 
          isSubscribing: false,
          token: token
        }));
        
        console.log('✅ Abonnement FCM réussi');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement du token FCM');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isSubscribing: false 
      }));
      console.error('❌ Erreur lors de l\'abonnement FCM:', error);
    }
  }, [state.isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!state.token) return;

    setState(prev => ({ ...prev, isSubscribing: true, error: null }));

    try {
      // Envoyer la demande de désabonnement au serveur
      const response = await fetch('/api/accounts/fcm/unsubscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          fcm_token: state.token
        })
      });

      if (response.ok) {
        // Supprimer le token du stockage local
        localStorage.removeItem('fcm_token');
        
        setState(prev => ({ 
          ...prev, 
          isSubscribed: false, 
          isSubscribing: false,
          token: null
        }));
        
        console.log('✅ Désabonnement FCM réussi');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du désabonnement FCM');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isSubscribing: false 
      }));
      console.error('❌ Erreur lors du désabonnement FCM:', error);
    }
  }, [state.token]);

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

  // Écouter les messages FCM en arrière-plan
  useEffect(() => {
    if (state.isSubscribed) {
      onFCMessage((payload) => {
        console.log('🔔 Message FCM reçu:', payload);
        // Ici vous pouvez ajouter une logique pour afficher des notifications
        // ou mettre à jour l'état de l'application
      });
    }
  }, [state.isSubscribed]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    toggle,
    clearError
  };
};
