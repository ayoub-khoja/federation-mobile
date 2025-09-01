/**
 * Service d'authentification
 */
import { ENVIRONMENT_CONFIG } from '../config/environment';
import { getApiUrl } from '../config/config';

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  tokens?: {
    access: string;
    refresh: string;
  };
  user?: any;
  errors?: any;
}

class AuthService {
  private get baseURL() {
    return getApiUrl(''); // Utilise la configuration unifiée
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/accounts/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: credentials.phoneNumber,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.detail || 'Erreur de connexion',
          errors: data.errors
        };
      }

      // Stocker les tokens dans localStorage
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user_data', JSON.stringify(data.user));
      }

      return {
        success: true,
        message: data.message || 'Connexion réussie',
        tokens: data.tokens,
        user: data.user
      };

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      // Vérifier le type d'erreur
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.',
          errors: { network: 'Connexion refusée' }
        };
      }
      
      return {
        success: false,
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        errors: { network: 'Erreur réseau' }
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await fetch(`${this.baseURL}/accounts/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            refresh_token: refreshToken
          })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getUser(): LoginResponse['user'] | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();

