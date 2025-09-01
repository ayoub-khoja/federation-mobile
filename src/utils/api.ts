/**
 * Configuration et utilitaires pour l'API Backend Django
 */

// Configuration de base avec détection mobile
const getApiBaseUrl = () => {
  // Utiliser localhost pour tous les cas pour éviter les problèmes de réseau
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Types pour l'authentification
export interface LoginData {
  phone_number: string;
  password: string;
}

export interface RegisterData extends LoginData {
  password_confirm: string;
  first_name: string;
  last_name: string;
  grade: string;
  league: string;
  email?: string;
  address?: string;
  birth_date?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  tokens?: {
    access: string;
    refresh: string;
  };
  user?: Record<string, unknown>;
  errors?: Record<string, unknown>;
}

// Types pour les matchs
export interface MatchData {
  match_type: string;
  category: string;
  stadium: string;
  match_date: string;
  match_time: string;
  home_team: string;
  away_team: string;
  description?: string;
  match_sheet?: File;
}

// Utilitaire pour gérer les tokens
export class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  static setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  static isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

// Client API avec gestion automatique des tokens
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getAccessToken();

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Gestion automatique du refresh token
      if (response.status === 401 && token) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry la requête avec le nouveau token
          const newToken = TokenManager.getAccessToken();
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${newToken}`,
          };
          return fetch(url, config);
        } else {
          // Refresh failed, redirect to login
          TokenManager.clearTokens();
          window.location.href = '/';
        }
      }

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        TokenManager.setTokens(data.access, refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }

    return false;
  }

  // Méthodes d'authentification
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.success && result.tokens) {
      TokenManager.setTokens(result.tokens.access, result.tokens.refresh);
    }

    return result;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request('/accounts/arbitres/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.success && result.tokens) {
      TokenManager.setTokens(result.tokens.access, result.tokens.refresh);
    }

    return result;
  }

  async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    TokenManager.clearTokens();
  }

  async getProfile(): Promise<any> {
    const response = await this.request('/auth/profile/simple/');
    return response.json();
  }

  async updateProfile(data: any): Promise<any> {
    const response = await this.request('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Méthodes pour les matchs
  async getMatches(): Promise<any> {
    const response = await this.request('/matches/');
    return response.json();
  }

  async createMatch(data: MatchData): Promise<any> {
    // Si on a un fichier, utiliser FormData
    if (data.match_sheet) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await this.request('/matches/', {
        method: 'POST',
        headers: {
          // Ne pas définir Content-Type pour FormData
          'Authorization': `Bearer ${TokenManager.getAccessToken()}`,
        },
        body: formData,
      });
      return response.json();
    } else {
      const response = await this.request('/matches/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    }
  }

  async getMatchStatistics(): Promise<any> {
    const response = await this.request('/matches/statistics/');
    return response.json();
  }

  async completeMatch(matchId: number, data: any): Promise<any> {
    const response = await this.request(`/matches/${matchId}/complete/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Test de santé de l'API
  async healthCheck(): Promise<any> {
    const response = await this.request('/auth/health/');
    return response.json();
  }
}

// Instance singleton de l'API client
export const apiClient = new ApiClient();

// Hooks React pour l'utilisation dans les composants
export const useApi = () => {
  return {
    client: apiClient,
    isAuthenticated: TokenManager.isAuthenticated,
    clearAuth: TokenManager.clearTokens,
  };
};

