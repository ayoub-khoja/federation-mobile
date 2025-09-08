/**
 * Configuration Firebase pour l'application
 * Remplace le système VAPID par Firebase Cloud Messaging (FCM)
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuration Firebase pour iOS, Android et Web
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB51FSdFZalgylYq677RlHGDT2o-iS4ifA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "federation-16c7a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "federation-16c7a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "federation-16c7a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "865044602349",
  // Pour le web, nous utilisons l'App ID web, sinon l'App ID iOS comme fallback
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_WEB || 
         process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 
         "1:865044602349:web:1ca0086e1512f626171be4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX" // Optionnel
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firebase Cloud Messaging
let messaging: any = null;

if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

export { messaging };

/**
 * Obtenir le token FCM pour l'utilisateur actuel
 */
export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn('Firebase Messaging non disponible');
    return null;
  }

  try {
    // Demander la permission pour les notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission refusée pour les notifications');
    }

    // Obtenir le token FCM
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BIXzfPVhX1sgOYE2ii2L8Yu3odvBet7R7L2iuRzp-MJW8E68ugDaGY7mUtF-tVkvdy8NkRHTr7zDS1MmZulzxCk"
    });

    if (token) {
      console.log('✅ Token FCM obtenu:', token);
      return token;
    } else {
      console.warn('❌ Aucun token FCM disponible');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'obtention du token FCM:', error);
    return null;
  }
};

/**
 * Écouter les messages FCM en arrière-plan
 */
export const onFCMessage = (callback: (payload: any) => void) => {
  if (!messaging) {
    console.warn('Firebase Messaging non disponible');
    return;
  }

  onMessage(messaging, (payload: any) => {
    console.log('🔔 Message FCM reçu en arrière-plan:', payload);
    callback(payload);
  });
};

/**
 * Vérifier si FCM est supporté
 */
export const isFCMSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Vérifier le contexte sécurisé (HTTPS ou localhost)
  if (!window.isSecureContext && !window.location.hostname.includes('localhost')) {
    console.warn('FCM nécessite un contexte sécurisé (HTTPS)');
    return false;
  }
  
  // Vérifier les APIs de base
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker non supporté');
    return false;
  }
  
  // Vérifier PushManager - peut être dans window ou dans ServiceWorkerRegistration
  const hasPushManager = 'PushManager' in window || 
                        ('serviceWorker' in navigator && 'PushManager' in ServiceWorkerRegistration.prototype);
  
  if (!hasPushManager) {
    console.warn('Push Manager non supporté');
    return false;
  }
  
  // Vérifier si les notifications sont supportées
  if (!('Notification' in window)) {
    console.warn('Notifications non supportées par ce navigateur');
    return false;
  }
  
  // Vérifier si Firebase est disponible
  if (!messaging) {
    console.warn('Firebase Messaging non initialisé');
    return false;
  }
  
  // Vérifier la version du navigateur pour les mobiles
  const userAgent = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  
  if (isMobile) {
    // Sur mobile, vérifier la version du navigateur
    if (isIOS) {
      // iOS nécessite une version récente
      const iosVersion = userAgent.match(/OS (\d+)_/);
      if (iosVersion && parseInt(iosVersion[1]) < 16) {
        console.warn('iOS version trop ancienne pour FCM');
        return false;
      }
      
      // Sur iOS Safari, les notifications push ne sont pas supportées de la même manière
      if (isSafari) {
        console.warn('iOS Safari ne supporte pas FCM. Utilisez Chrome ou Firefox sur iOS.');
        return false;
      }
    } else if (userAgent.includes('Android')) {
      // Android nécessite Chrome 50+ ou Firefox 44+
      const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
      const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
      
      if (chromeMatch && parseInt(chromeMatch[1]) < 50) {
        console.warn('Chrome version trop ancienne pour FCM');
        return false;
      }
      
      if (firefoxMatch && parseInt(firefoxMatch[1]) < 44) {
        console.warn('Firefox version trop ancienne pour FCM');
        return false;
      }
    }
  }
  
  return true;
};

export default app;
