/**
 * Hook pour écouter les événements d'authentification
 * Gère automatiquement les tokens expirés et les déconnexions
 */

import { useEffect, useCallback } from 'react';

export const useAuthEvents = () => {
  const handleTokenExpired = useCallback((event: CustomEvent) => {

    
    // Nettoyer le localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // Afficher une notification à l'utilisateur
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Session expirée', {
        body: 'Votre session a expiré. Veuillez vous reconnecter.',
        icon: '/ftf-logo.png',
        tag: 'auth-expired'
      });
    }
    
    // Rediriger vers la page de connexion après un délai
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  }, []);

  const handleStorageChange = useCallback((event: StorageEvent) => {
    // Écouter les changements dans le localStorage d'autres onglets
    if (event.key === 'access_token' && !event.newValue) {
  
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    // Écouter l'événement de token expiré
    window.addEventListener('auth:token-expired', handleTokenExpired as EventListener);
    
    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement la validité du token
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          
          // Si le token expire dans moins de 5 minutes, avertir l'utilisateur
          if (payload.exp - now < 300) {
    
            // Émettre un événement pour avertir l'utilisateur
            window.dispatchEvent(new CustomEvent('auth:token-expiring-soon', {
              detail: { 
                expiresIn: payload.exp - now,
                message: 'Votre session expirera bientôt'
              }
            }));
          }
          
          // Si le token est expiré, le nettoyer
          if (payload.exp < now) {
    
            window.dispatchEvent(new CustomEvent('auth:token-expired', {
              detail: { message: 'Token expiré détecté' }
            }));
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          // Token invalide, le nettoyer
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
        }
      }
    }, 60000); // Vérifier toutes les minutes

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(tokenCheckInterval);
    };
  }, [handleTokenExpired, handleStorageChange]);

  // Fonction pour forcer la déconnexion
  const forceLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  }, []);

  // Fonction pour vérifier si l'utilisateur est connecté
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    forceLogout
  };
};
