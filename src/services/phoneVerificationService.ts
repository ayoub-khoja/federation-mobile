/**
 * Service de vérification des numéros de téléphone
 * Vérifie si un numéro de téléphone est déjà utilisé par un arbitre
 */

export interface PhoneVerificationResponse {
  success: boolean;
  exists: boolean;
  message: string;
  normalized_phone?: string;
  user_type?: string;
  user_info?: any;
  error_code?: string;
}

export interface PhoneVerificationError {
  success: false;
  message: string;
  error_code?: string;
}

/**
 * Vérifie si un numéro de téléphone est disponible
 * @param phoneNumber - Le numéro de téléphone à vérifier (format: +216XXXXXXXX)
 * @returns Promise<PhoneVerificationResponse | PhoneVerificationError>
 */
export const verifyPhoneNumber = async (
  phoneNumber: string
): Promise<PhoneVerificationResponse | PhoneVerificationError> => {
  try {
    // Garder le numéro avec le préfixe +216
    const phoneToSend = phoneNumber; // Garder le format +216XXXXXXXX
    
    // Validation basique du format
    if (!/^\+216\d{8}$/.test(phoneToSend)) {
      return {
        success: false,
        message: 'Format de numéro invalide. Utilisez le format +216XXXXXXXX',
        error_code: 'INVALID_FORMAT'
      };
    }

    // Utiliser la configuration unifiée de l'API
    const { getApiUrl } = await import('../config/api');

    // Appel à l'API de vérification avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

    console.log('🔍 Vérification du numéro:', {
      phone: phoneToSend,
      url: getApiUrl('/accounts/verify-phone/'),
      timestamp: new Date().toISOString()
    });

    const response = await fetch(getApiUrl('/accounts/verify-phone/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneToSend
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Réponse API vérification téléphone:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorMessage = "Erreur lors de la vérification du numéro";

      try {
        const errorData = await response.json();
        console.error("❌ Erreur API:", errorData);
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch {
        if (response.status === 404) {
          errorMessage = "Service de vérification non disponible";
        } else if (response.status >= 500) {
          errorMessage = "Erreur serveur lors de la vérification";
        }
      }

      return {
        success: false,
        message: errorMessage,
        error_code: "API_ERROR",
      };
    }

    const data = await response.json();
    console.log("✅ Données reçues de l'API:", data);
    return data;

  } catch (error) {
    console.error('Erreur lors de la vérification du numéro:', error);
    
    // Gestion des erreurs de timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Timeout: La vérification a pris trop de temps. Veuillez réessayer.',
        error_code: 'TIMEOUT_ERROR'
      };
    }
    
    // Gestion des erreurs de connexion
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        error_code: 'CONNECTION_ERROR'
      };
    }
    
    return {
      success: false,
      message: 'Erreur inattendue lors de la vérification',
      error_code: 'UNKNOWN_ERROR'
    };
  }
};

/**
 * Formate un numéro de téléphone pour l'affichage
 * @param phoneNumber - Le numéro de téléphone
 * @returns Le numéro formaté
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const clean = phoneNumber.replace(/\D/g, '');
  if (clean.startsWith('216') && clean.length === 11) {
    return `+${clean}`;
  }
  return phoneNumber;
};

/**
 * Normalise un numéro de téléphone pour l'API
 * @param phoneNumber - Le numéro de téléphone
 * @returns Le numéro normalisé (sans +)
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[\s+]/g, '');
};
