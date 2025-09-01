/**
 * Hook personnalisé pour gérer l'état d'authentification
 */

import { useState, useEffect, useCallback } from 'react';

interface AuthenticationState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

interface AuthenticationActions {
  checkAuth: () => boolean;
  login: (tokens: { access: string; refresh: string }, userData: any) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

export const useAuthentication = (): [AuthenticationState, AuthenticationActions] => {
  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });

  // Vérifier l'authentification au chargement
  const checkAuth = useCallback((): boolean => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        // Vérifier si le token n'est pas expiré
        const isExpired = isTokenExpired(token);
        
        if (!isExpired) {
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            user: JSON.parse(userData),
            isLoading: false
          }));
          return true;
        } else {
          // Token expiré, essayer de le rafraîchir
  
          refreshToken();
          return false;
        }
      } else {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          isLoading: false
        }));
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false
      }));
      return false;
    }
  }, []);

  // Vérifier si un token est expiré
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return true;
    }
  };

  // Rafraîchir le token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      

      const response = await fetch('/api/accounts/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Sauvegarder les nouveaux tokens
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false
        }));


        return true;
      } else {
        throw new Error('Échec du rafraîchissement du token');
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement du token:', error);
      
      // En cas d'échec, déconnecter l'utilisateur
      logout();
      return false;
    }
  }, []);

  // Se connecter
  const login = useCallback((tokens: { access: string; refresh: string }, userData: any) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(userData));

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: userData,
      isLoading: false
    }));

    console.log('✅ Utilisateur connecté:', userData);
  }, []);

  // Se déconnecter
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');

    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      isLoading: false
    }));

    console.log('🔓 Utilisateur déconnecté');
  }, []);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Vérifier périodiquement l'authentification
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        const token = localStorage.getItem('access_token');
        if (token && isTokenExpired(token)) {
  
          refreshToken();
        }
      }, 60000); // Vérifier toutes les minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, refreshToken]);

  return [
    state,
    {
      checkAuth,
      login,
      logout,
      refreshToken
    }
  ];
};
