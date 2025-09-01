/**
 * Configuration des variables d'environnement
 * Clés VAPID partagées avec le backend Django
 */

export const ENVIRONMENT_CONFIG = {
      // Clés VAPID pour les notifications push (mêmes que backend)
    VAPID: {
        PUBLIC_KEY: 'BDpgiiNfAzMtRqsTFxRI_KvGtYGjbwFnbRklbKk4_AgmaDiXJQivL3yP2HLtOlzBOKqkXTtYpA9iHuHSKEVlRdE',
        // Note: La clé privée n'est pas exposée côté client
    },
  
  // URL de l'API backend
  API: {
    BASE_URL: 'http://localhost:8000/api',
    TIMEOUT: 10000,
  },
  
  // Configuration des notifications
  NOTIFICATIONS: {
    TITLE: 'FTF Arbitrage',
    ICON: '/ftf-logo.png',
    BADGE: '/ftf-logo.png',
    AUTO_CLOSE_DELAY: 5000,
  },
  
  // Configuration du service worker
  SERVICE_WORKER: {
    SCOPE: '/',
    FILE: '/sw.js',
  },
  
  // Mode de développement
  DEVELOPMENT: {
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
};

// Export de la clé publique VAPID pour Next.js
export const NEXT_PUBLIC_VAPID_PUBLIC_KEY = ENVIRONMENT_CONFIG.VAPID.PUBLIC_KEY;

// Fonction utilitaire pour vérifier la configuration
export const validateConfig = () => {
  const issues = [];
  
  if (!ENVIRONMENT_CONFIG.VAPID.PUBLIC_KEY || ENVIRONMENT_CONFIG.VAPID.PUBLIC_KEY === 'your_vapid_public_key_here') {
    issues.push('Clé VAPID publique non configurée');
  }
  
  if (!ENVIRONMENT_CONFIG.API.BASE_URL) {
    issues.push('URL de l\'API non configurée');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config: ENVIRONMENT_CONFIG
  };
};

// Fonction utilitaire pour obtenir l'URL complète d'un endpoint
export const getApiUrl = (endpoint: string) => {
  return `${ENVIRONMENT_CONFIG.API.BASE_URL}${endpoint}`;
};

// Fonction utilitaire pour vérifier si on est en développement
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Fonction utilitaire pour logger en mode développement
export const devLog = (message: string, data?: unknown) => {
  if (isDevelopment()) {
    console.log(`[DEV] ${message}`, data || '');
  }
};


