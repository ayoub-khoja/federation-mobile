/**
 * Configuration pour les routes API Next.js
 * Évite les problèmes d'import circulaire
 */

export const getBackendUrl = (): string => {
  // Détecter l'environnement
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return 'https://federation-backend.onrender.com';
  }
  return 'http://localhost:8000';
};

export const getApiUrl = (endpoint: string): string => {
  return `${getBackendUrl()}/api${endpoint}`;
};
