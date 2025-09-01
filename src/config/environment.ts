/**
 * Configuration des variables d'environnement
 * Clés VAPID partagées avec le backend Django
 */

// Fonction utilitaire pour vérifier si on est en développement
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Fonction pour déterminer automatiquement l'URL de l'API selon l'environnement
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production sur Vercel
    if (hostname === 'federation-mobile-front.vercel.app') {
      return 'https://federation-backend.onrender.com/api';
    }
    
    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api';
    }
    
    // Autres environnements (staging, etc.)
    return `https://${hostname}/api`;
  }
  
  // Côté serveur - utiliser l'environnement local par défaut
  return process.env.NODE_ENV === 'production' 
    ? 'https://federation-backend.onrender.com/api' 
    : 'http://localhost:8000/api';
}

export const ENVIRONMENT_CONFIG = {
      // Clés VAPID pour les notifications push (mêmes que backend)
    VAPID: {
        PUBLIC_KEY: 'BDpgiiNfAzMtRqsTFxRI_KvGtYGjbwFnbRklbKk4_AgmaDiXJQivL3yP2HLtOlzBOKqkXTtYpA9iHuHSKEVlRdE',
        // Note: La clé privée n'est pas exposée côté client
    },
  
  // URL de l'API backend - Configuration automatique selon l'environnement
  API: {
    BASE_URL: getApiBaseUrl(),
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
    DEBUG: isDevelopment(),
    LOG_LEVEL: isDevelopment() ? 'debug' : 'info',
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

// Fonction utilitaire pour logger en mode développement
export const devLog = (message: string, data?: unknown) => {
  if (isDevelopment()) {
    console.log(`[DEV] ${message}`, data || '');
  }
};

// Fonction utilitaire pour obtenir l'URL de base de l'application
export const getAppBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'production' 
    ? 'https://federation-mobile-front.vercel.app' 
    : 'http://localhost:3000';
};


