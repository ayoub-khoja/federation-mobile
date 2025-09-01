/**
 * Configuration centralisée de l'API
 * Configuration automatique pour local et production
 */

import { getApiBaseUrl } from './environment';

export const API_CONFIG = {
  // URL de base de l'API - Détection automatique selon l'environnement
  BASE_URL: getApiBaseUrl(),
  
  // Endpoints d'authentification
  ENDPOINTS: {
    LOGIN: '/accounts/auth/login/',
    LOGOUT: '/accounts/auth/logout/',
    REGISTER: '/accounts/arbitres/register/',
    PROFILE: '/accounts/arbitres/profile/',
    REFRESH_TOKEN: '/accounts/token/refresh/',
    PROFILE_UPDATE: '/accounts/arbitres/profile/update/',
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

// Fonction pour obtenir l'URL de base selon l'environnement
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production sur Vercel
    if (hostname === 'federation-mobile-front.vercel.app') {
      return 'https://federation-backend.onrender.com';
    }
    
    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    
    // Autres environnements
    return `https://${hostname}`;
  }
  
  // Côté serveur
  return process.env.NODE_ENV === 'production' 
    ? 'https://federation-backend.onrender.com' 
    : 'http://localhost:8000';
};
