/**
 * Configuration unifiée pour tous les environnements
 * Local et Production
 */

export const APP_CONFIG = {
  // Environnements
  ENVIRONMENTS: {
    LOCAL: 'local',
    PRODUCTION: 'production'
  },
  
  // URLs des backends
  BACKENDS: {
    LOCAL: 'http://localhost:8000',
    PRODUCTION: 'https://federation-backend.onrender.com'
  },
  
  // Domaine de production
  PRODUCTION_DOMAIN: 'federation-mobile-front.vercel.app',
  
  // Configuration des API
  API: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    ENDPOINTS: {
      // Authentification
      LOGIN: '/accounts/auth/login/',
      LOGOUT: '/accounts/auth/logout/',
      REGISTER: '/accounts/arbitres/register/',
      REFRESH_TOKEN: '/accounts/token/refresh/',
      
      // Profil utilisateur
      PROFILE: '/accounts/arbitres/profile/',
      PROFILE_UPDATE: '/accounts/arbitres/profile/update/',
      
      // Notifications (ancien système VAPID)
      PUSH_SUBSCRIBE: '/notifications/push/subscribe/',
      PUSH_UNSUBSCRIBE: '/notifications/push/unsubscribe/',
      
      // Notifications Firebase Cloud Messaging (nouveau)
      FCM_SUBSCRIBE: '/notifications/fcm/subscribe/',
      FCM_UNSUBSCRIBE: '/notifications/fcm/unsubscribe/',
      
      // Tests
      TEST: '/test/',
      PUSH_STATUS: '/accounts/push/status/',
      PUSH_TEST: '/accounts/push/test/',
      PUSH_UNSUBSCRIBE_ACCOUNT: '/accounts/push/unsubscribe/'
    }
  },
  
  // Configuration PWA
  PWA: {
    NAME: 'Louvre PWA - Système d\'Arbitrage',
    SHORT_NAME: 'Louvre PWA',
    DESCRIPTION: 'Application PWA pour la gestion des arbitres et des désignations',
    THEME_COLOR: '#dc2626',
    BACKGROUND_COLOR: '#dc2626',
    ICONS: {
      SMALL: '/cartons.png',
      LARGE: '/cartons.png'
    }
  },
  
  // Configuration des notifications
  NOTIFICATIONS: {
    TITLE: 'FTF Arbitrage',
    ICON: '/ftf-logo.png',
    BADGE: '/ftf-logo.png',
    AUTO_CLOSE_DELAY: 5000,
    // Ancien système VAPID (déprécié)
    VAPID_PUBLIC_KEY: 'BDpgiiNfAzMtRqsTFxRI_KvGtYGjbwFnbRklbKk4_AgmaDiXJQivL3yP2HLtOlzBOKqkXTtYpA9iHuHSKEVlRdE',
    // Nouveau système Firebase Cloud Messaging
    FCM: {
      VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'your-vapid-key',
      PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id'
    }
  }
};

// Fonction pour détecter l'environnement actuel
export const getCurrentEnvironment = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === APP_CONFIG.PRODUCTION_DOMAIN) {
      return APP_CONFIG.ENVIRONMENTS.PRODUCTION;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return APP_CONFIG.ENVIRONMENTS.LOCAL;
    }
  }
  
  return process.env.NODE_ENV === 'production' 
    ? APP_CONFIG.ENVIRONMENTS.PRODUCTION 
    : APP_CONFIG.ENVIRONMENTS.LOCAL;
};

// Fonction pour obtenir l'URL du backend selon l'environnement
export const getBackendUrl = (): string => {
  const env = getCurrentEnvironment();
  return env === APP_CONFIG.ENVIRONMENTS.PRODUCTION 
    ? APP_CONFIG.BACKENDS.PRODUCTION 
    : APP_CONFIG.BACKENDS.LOCAL;
};

// Fonction pour obtenir l'URL complète d'un endpoint API
export const getApiUrl = (endpoint: string): string => {
  return `${getBackendUrl()}/api${endpoint}`;
};

// Fonction pour vérifier si on est en production
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === APP_CONFIG.ENVIRONMENTS.PRODUCTION;
};

// Fonction pour vérifier si on est en local
export const isLocal = (): boolean => {
  return getCurrentEnvironment() === APP_CONFIG.ENVIRONMENTS.LOCAL;
};

// Fonction pour obtenir la configuration de debug
export const getDebugConfig = () => {
  return {
    isDebug: !isProduction(),
    environment: getCurrentEnvironment(),
    backendUrl: getBackendUrl(),
    apiBaseUrl: `${getBackendUrl()}/api`
  };
};
