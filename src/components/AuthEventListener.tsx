/**
 * Composant d'écoute des événements d'authentification
 * Gère automatiquement les sessions expirées et les déconnexions
 */

import React, { useEffect, useCallback } from 'react';

interface AuthEventDetail {
  message?: string;
  error?: string;
  timestamp?: string;
  [key: string]: unknown;
}

interface AuthEventListenerProps {
  onTokenExpired?: (details: AuthEventDetail) => void;
  onTokenRefreshed?: (details: AuthEventDetail) => void;
  onAuthFailed?: (details: AuthEventDetail) => void;
}

export const AuthEventListener: React.FC<AuthEventListenerProps> = ({ 
  onTokenExpired, 
  onTokenRefreshed
}) => {
  
  // Gérer l'expiration du token
  const handleTokenExpired = useCallback((event: CustomEvent<AuthEventDetail>) => {

    
    // Appeler le callback personnalisé si fourni
    if (onTokenExpired) {
      onTokenExpired(event.detail);
    }
    
    // Émettre un événement global pour informer l'application
    window.dispatchEvent(new CustomEvent('app:session-expired', {
      detail: {
        ...event.detail,
        timestamp: new Date().toISOString(),
        action: 'reconnect_required'
      }
    }));
  }, [onTokenExpired]);
  
  // Gérer le rafraîchissement réussi du token
  const handleTokenRefreshed = useCallback((event: CustomEvent<AuthEventDetail>) => {

    
    // Appeler le callback personnalisé si fourni
    if (onTokenRefreshed) {
      onTokenRefreshed(event.detail);
    }
    
  }, [onTokenRefreshed]);
  
  // Gérer l'échec du rafraîchissement du token
  const handleTokenRefreshFailed = useCallback((event: CustomEvent<AuthEventDetail>) => {

    
    // Émettre un événement global pour informer l'application
    window.dispatchEvent(new CustomEvent('app:token-refresh-failed', {
      detail: {
        ...event.detail,
        timestamp: new Date().toISOString(),
        action: 'reconnect_required'
      }
    }));
  }, []);
  
  // Gérer les événements spécifiques aux notifications
  const handleNotificationsAuthFailed = useCallback((event: CustomEvent<AuthEventDetail>) => {

    
    // Émettre un événement global pour informer l'application
    window.dispatchEvent(new CustomEvent('app:notifications-auth-failed', {
      detail: {
        ...event.detail,
        timestamp: new Date().toISOString(),
        action: 'reconnect_required'
      }
    }));
  }, []);
  
  useEffect(() => {
    // Écouter tous les événements d'authentification
    window.addEventListener('auth:token-expired', handleTokenExpired as EventListener);
    window.addEventListener('auth:token-refreshed', handleTokenRefreshed as EventListener);
    window.addEventListener('auth:token-refresh-failed', handleTokenRefreshFailed as EventListener);
    window.addEventListener('notifications:auth-failed', handleNotificationsAuthFailed as EventListener);
    
    // Nettoyer les écouteurs d'événements
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired as EventListener);
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed as EventListener);
      window.removeEventListener('auth:token-refresh-failed', handleTokenRefreshFailed as EventListener);
      window.removeEventListener('notifications:auth-failed', handleNotificationsAuthFailed as EventListener);
    };
  }, [handleTokenExpired, handleTokenRefreshed, handleTokenRefreshFailed, handleNotificationsAuthFailed]);
  
  // Ce composant ne rend rien visuellement
  return null;
};

export default AuthEventListener;
