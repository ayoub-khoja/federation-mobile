/**
 * Configuration centralisée de l'API
 */

export const API_CONFIG = {
  // URL de base de l'API - Utiliser localhost pour le développement
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  
  // Endpoints d'authentification
  ENDPOINTS: {
    LOGIN: '/accounts/auth/login/',
    LOGOUT: '/accounts/auth/logout/',
    REGISTER: '/accounts/arbitres/register/',
    PROFILE: '/accounts/arbitres/profile/',
    REFRESH_TOKEN: '/accounts/token/refresh/',
  },
  
  // Configuration des requêtes
  REQUEST_CONFIG: {
    TIMEOUT: 10000, // 10 secondes
    RETRY_ATTEMPTS: 3,
  },
  
  // Messages d'erreur
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
    SERVER_ERROR: 'Erreur du serveur. Veuillez réessayer plus tard.',
    AUTH_ERROR: 'Erreur d\'authentification. Vérifiez vos identifiants.',
    TIMEOUT_ERROR: 'Délai d\'attente dépassé. Vérifiez votre connexion.',
  }
};

// Fonction pour obtenir l'URL complète d'un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour détecter l'environnement
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Fonction pour détecter si on est sur mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
