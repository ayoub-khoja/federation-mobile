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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  user_type?: string;
  expires_in_minutes?: number;
  instructions?: string;
  token?: string;
  errors?: any;
}

export interface VerifyOTPRequest {
  token: string;
  otp_code: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  errors?: any;
}

export interface ConfirmPasswordResetRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ConfirmPasswordResetResponse {
  success: boolean;
  message: string;
  errors?: any;
}

export interface ValidateTokenResponse {
  success: boolean;
  message: string;
  valid?: boolean;
  expires_at?: string;
  otp_verified?: boolean;
  user_info?: {
    email: string;
    user_type: string;
    user_name: string;
  };
  next_step?: string;
  errors?: any;
}

class AuthService {
  private get baseURL() {
    return getApiUrl(''); // Utilise la configuration unifiée
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('🔍 Debug connexion:', {
        phoneNumber: credentials.phoneNumber,
        format: /^\+216\d{8}$/.test(credentials.phoneNumber) ? '✅ Valide' : '❌ Invalide'
      });

      const response = await fetch(`${this.baseURL}/accounts/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: credentials.phoneNumber, // Envoyer avec le préfixe +216
          password: credentials.password
        })
      });

      const data = await response.json();
      console.log('📡 Réponse API connexion:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

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

  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      console.log('🔍 Récupération mot de passe:', {
        email: request.email,
        format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email) ? '✅ Valide' : '❌ Invalide'
      });

      const response = await fetch(`${this.baseURL}/accounts/password-reset/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: request.email
        })
      });

      const data = await response.json();
      console.log('📡 Réponse API récupération mot de passe:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.detail || 'Erreur lors de l\'envoi du code',
          errors: data.errors
        };
      }

      return {
        success: true,
        message: data.message || 'Code de réinitialisation envoyé',
        user_type: data.user_type,
        expires_in_minutes: data.expires_in_minutes,
        instructions: data.instructions,
        token: data.token
      };

    } catch (error) {
      console.error('Erreur lors de la récupération de mot de passe:', error);
      
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
        message: 'Erreur lors de l\'envoi du code. Vérifiez votre connexion internet.',
        errors: { network: 'Erreur réseau' }
      };
    }
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      console.log('🔍 Vérification OTP:', {
        token: request.token ? '✅ Présent' : '❌ Manquant',
        otp_code: request.otp_code ? '✅ Présent' : '❌ Manquant'
      });

      const response = await fetch(`${this.baseURL}/accounts/password-reset/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: request.token,
          otp_code: request.otp_code
        })
      });

      const data = await response.json();
      console.log('📡 Réponse API vérification OTP:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.detail || 'Erreur lors de la vérification du code',
          errors: data.errors
        };
      }

      return {
        success: true,
        message: data.message || 'Code OTP vérifié avec succès',
        token: data.token
      };

    } catch (error) {
      console.error('Erreur lors de la vérification OTP:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.',
          errors: { network: 'Connexion refusée' }
        };
      }
      
      return {
        success: false,
        message: 'Erreur lors de la vérification du code. Vérifiez votre connexion internet.',
        errors: { network: 'Erreur réseau' }
      };
    }
  }

  async confirmPasswordReset(request: ConfirmPasswordResetRequest): Promise<ConfirmPasswordResetResponse> {
    try {
      console.log('🔍 DEBUG: Début de la réinitialisation de mot de passe');
      console.log('📤 Données envoyées:', {
        token: request.token ? request.token.substring(0, 10) + '...' : 'undefined',
        password_length: request.new_password.length,
        passwords_match: request.new_password === request.confirm_password
      });

      const response = await fetch(`${this.baseURL}/accounts/password-reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: request.token,
          new_password: request.new_password,
          confirm_password: request.confirm_password
        })
      });

      const data = await response.json();
      
      console.log('📡 Réponse du backend:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (!response.ok) {
        console.error('❌ Erreur backend:', data);
        return {
          success: false,
          message: data.message || data.detail || 'Erreur lors de la réinitialisation',
          errors: data.errors
        };
      }

      console.log('✅ Backend dit que c\'est réussi, mais testons...');
      return {
        success: true,
        message: data.message || 'Mot de passe réinitialisé avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la confirmation de réinitialisation:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.',
          errors: { network: 'Connexion refusée' }
        };
      }
      
      return {
        success: false,
        message: 'Erreur lors de la réinitialisation. Vérifiez votre connexion internet.',
        errors: { network: 'Erreur réseau' }
      };
    }
  }

  async validateResetToken(token: string): Promise<ValidateTokenResponse> {
    try {
      console.log('🔍 Validation token:', {
        token: token ? '✅ Présent' : '❌ Manquant'
      });

      const response = await fetch(`${this.baseURL}/accounts/password-reset/validate/${token}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('📡 Réponse API validation token:', {
        status: response.status,
        ok: response.ok,
        data: data
      });
      console.log('📡 Données brutes du backend:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.detail || 'Token invalide ou expiré',
          valid: false,
          errors: data.errors
        };
      }

      // Vérifier si le backend retourne un champ 'valid' ou un autre indicateur
      const isValid = data.valid !== undefined ? data.valid : 
                     data.is_valid !== undefined ? data.is_valid :
                     data.status === 'valid' ? true :
                     data.status === 'active' ? true :
                     data.success === true ? true :  // Utiliser le champ 'success' du backend
                     false;

      console.log('📡 Token valide déterminé:', isValid, 'basé sur:', {
        'data.valid': data.valid,
        'data.is_valid': data.is_valid,
        'data.status': data.status,
        'data.success': data.success
      });

      return {
        success: true,
        message: data.message || 'Token valide',
        valid: isValid,
        expires_at: data.expires_at,
        otp_verified: data.otp_verified,
        user_info: data.user_info,
        next_step: data.next_step
      };

    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      
      // Logs de débogage supprimés - le système fonctionne parfaitement
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.',
          valid: false,
          errors: { network: 'Connexion refusée' }
        };
      }
      
      return {
        success: false,
        message: 'Erreur lors de la validation. Vérifiez votre connexion internet.',
        valid: false,
        errors: { network: 'Erreur réseau' }
      };
    }
  }
}

export const authService = new AuthService();

