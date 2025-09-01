/**
 * Service de gestion automatique du refresh des tokens JWT
 * Maintient la session active en arrière-plan
 */

import { ENVIRONMENT_CONFIG } from '../config/environment';

interface TokenRefreshResponse {
  access: string;
  refresh: string;
  success: boolean;
  message?: string;
}

class TokenRefreshService {
  private refreshInterval: NodeJS.Timeout | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<TokenRefreshResponse> | null = null;

  constructor() {
    this.startAutoRefresh();
  }

  /**
   * Démarrer le refresh automatique
   */
  private startAutoRefresh(): void {
    // Vérifier toutes les 4 minutes (240 secondes)
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshToken();
    }, 4 * 60 * 1000);

    // Vérifier immédiatement au démarrage
    this.checkAndRefreshToken();
  }

  /**
   * Vérifier et rafraîchir le token si nécessaire
   */
  private async checkAndRefreshToken(): Promise<void> {
    try {
      // Vérifier que nous sommes dans le navigateur
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('🔑 Pas dans le navigateur, impossible d\'accéder à localStorage');
        return;
      }
      
      const token = localStorage.getItem('access_token');
      if (!token) {

        return;
      }

      // Vérifier si le token expire bientôt (dans les 5 minutes)
      const timeUntilExpiry = this.getTimeUntilExpiry(token);
      
      if (timeUntilExpiry <= 300) { // 5 minutes = 300 secondes

        await this.refreshToken();
      } else {
        
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du token:', error);
    }
  }

  /**
   * Calculer le temps restant avant expiration
   */
  private getTimeUntilExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - now);
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return 0;
    }
  }

  /**
   * Rafraîchir le token
   */
  private async refreshToken(): Promise<TokenRefreshResponse> {
    // Éviter les refresh multiples simultanés
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    
    try {
      // Vérifier que nous sommes dans le navigateur
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        throw new Error('Pas dans le navigateur, impossible d\'accéder à localStorage');
      }
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      

      const response = await fetch(`${ENVIRONMENT_CONFIG.API.BASE_URL}/accounts/token/refresh/`, {
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
        
        // Mettre à jour les tokens
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }


        
        // Émettre un événement de succès
        window.dispatchEvent(new CustomEvent('auth:token-refreshed', {
          detail: { message: 'Token rafraîchi avec succès' }
        }));

        return {
          access: data.access,
          refresh: data.refresh || refreshToken,
          success: true
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      
      // En cas d'échec, nettoyer les tokens
      this.clearTokens();
      
      // Émettre un événement d'échec
      window.dispatchEvent(new CustomEvent('auth:token-refresh-failed', {
        detail: { message: 'Échec du rafraîchissement du token' }
      }));

      return {
        access: '',
        refresh: '',
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Rafraîchir le token manuellement
   */
  public async manualRefresh(): Promise<TokenRefreshResponse> {
    return this.refreshToken();
  }

  /**
   * Vérifier si un refresh est en cours
   */
  public isRefreshingToken(): boolean {
    return this.isRefreshing;
  }

  /**
   * Nettoyer les tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  /**
   * Arrêter le service
   */
  public stop(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Redémarrer le service
   */
  public restart(): void {
    this.stop();
    this.startAutoRefresh();
  }
}

// Instance globale du service
export const tokenRefreshService = new TokenRefreshService();

// Fonction utilitaire pour rafraîchir manuellement
export const refreshToken = () => tokenRefreshService.manualRefresh();

// Fonction utilitaire pour vérifier l'état
export const isTokenRefreshing = () => tokenRefreshService.isRefreshingToken();
