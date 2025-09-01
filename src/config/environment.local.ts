/**
 * Configuration d'environnement local
 * Ce fichier peut être modifié selon vos besoins de développement
 */

export const LOCAL_CONFIG = {
  // Backend local
  LOCAL_BACKEND: 'http://localhost:8000/api',
  
  // Backend de production
  PRODUCTION_BACKEND: 'https://federation-backend.onrender.com/api',
  
  // Domaine de production
  PRODUCTION_DOMAIN: 'federation-mobile-front.vercel.app',
  
  // Mode debug
  DEBUG: true,
  
  // Timeout des requêtes API
  API_TIMEOUT: 10000,
};

// Fonction pour obtenir l'URL de l'API selon l'environnement
export const getBackendUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production sur Vercel
    if (hostname === LOCAL_CONFIG.PRODUCTION_DOMAIN) {
      return LOCAL_CONFIG.PRODUCTION_BACKEND;
    }
    
    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return LOCAL_CONFIG.LOCAL_BACKEND;
    }
    
    // Autres environnements
    return `https://${hostname}/api`;
  }
  
  // Côté serveur
  return process.env.NODE_ENV === 'production' 
    ? LOCAL_CONFIG.PRODUCTION_BACKEND 
    : LOCAL_CONFIG.LOCAL_BACKEND;
};
