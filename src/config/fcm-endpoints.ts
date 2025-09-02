/**
 * Configuration des endpoints FCM pour l'application
 * Centralise tous les endpoints liés aux notifications FCM
 */

// Endpoints FCM pour le frontend
export const FCM_ENDPOINTS = {
  // Enregistrer un token FCM
  subscribe: '/api/accounts/fcm/subscribe/',
  
  // Désactiver un token FCM
  unsubscribe: '/api/accounts/fcm/unsubscribe/',
  
  // Statut des tokens de l'utilisateur
  status: '/api/accounts/fcm/status/',
  
  // Tester l'envoi de notification
  test: '/api/accounts/fcm/test/',
  
  // Statistiques (admin seulement)
  stats: '/api/accounts/fcm/stats/',
  
  // Envoyer un broadcast (admin seulement)
  broadcast: '/api/accounts/fcm/broadcast/'
};

// Endpoints FCM pour les applications mobiles (backend direct)
export const FCM_MOBILE_ENDPOINTS = {
  // Enregistrer un token FCM mobile
  subscribe: 'https://federation-backend.onrender.com/api/accounts/fcm/subscribe/',
  
  // Désactiver un token FCM mobile
  unsubscribe: 'https://federation-backend.onrender.com/api/accounts/fcm/unsubscribe/',
  
  // Statut des tokens de l'utilisateur mobile
  status: 'https://federation-backend.onrender.com/api/accounts/fcm/status/',
  
  // Tester l'envoi de notification mobile
  test: 'https://federation-backend.onrender.com/api/accounts/fcm/test/',
  
  // Statistiques (admin seulement)
  stats: 'https://federation-backend.onrender.com/api/accounts/fcm/stats/',
  
  // Envoyer un broadcast (admin seulement)
  broadcast: 'https://federation-backend.onrender.com/api/accounts/fcm/broadcast/'
};

// Configuration des endpoints selon l'environnement
export const getFCMEndpoints = (isMobile: boolean = false) => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://federation-backend.onrender.com/api'
    : 'http://localhost:8000/api';

  if (isMobile) {
    return {
      subscribe: `${baseUrl}/accounts/fcm/subscribe/`,
      unsubscribe: `${baseUrl}/accounts/fcm/unsubscribe/`,
      status: `${baseUrl}/accounts/fcm/status/`,
      test: `${baseUrl}/accounts/fcm/test/`,
      stats: `${baseUrl}/accounts/fcm/stats/`,
      broadcast: `${baseUrl}/accounts/fcm/broadcast/`
    };
  }

  return FCM_ENDPOINTS;
};

// Types pour les requêtes FCM
export interface FCMSubscribeRequest {
  fcm_token: string;
  device_type?: 'web' | 'ios' | 'android';
  device_id?: string;
  app_version?: string;
  user_agent?: string;
}

export interface FCMUnsubscribeRequest {
  fcm_token: string;
}

export interface FCMStatusResponse {
  is_subscribed: boolean;
  device_type: string;
  last_updated: string;
  is_active: boolean;
}

export interface FCMTestResponse {
  success: boolean;
  message: string;
  sent_at: string;
}

