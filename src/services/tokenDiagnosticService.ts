/**
 * Service de diagnostic avancé des tokens JWT
 * Analyse en détail la structure et la validité des tokens
 */

interface TokenAnalysis {
  isValid: boolean;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  expiration: Date;
  timeUntilExpiry: number;
  isExpired: boolean;
  issues: string[];
  recommendations: string[];
}

interface JWTPayload {
  exp?: number;
  iat?: number;
  user_id?: string;
  sub?: string;
  [key: string]: unknown;
}

class TokenDiagnosticService {
  /**
   * Analyser un token JWT en détail
   */
  public analyzeToken(token: string): TokenAnalysis {
    const analysis: TokenAnalysis = {
      isValid: false,
      header: null,
      payload: null,
      signature: '',
      expiration: new Date(),
      timeUntilExpiry: 0,
      isExpired: false,
      issues: [],
      recommendations: []
    };

    try {
      // Vérifier le format JWT (3 parties séparées par des points)
      const parts = token.split('.');
      if (parts.length !== 3) {
        analysis.issues.push('Format JWT invalide: doit contenir 3 parties séparées par des points');
        return analysis;
      }

      // Décoder l'en-tête
      try {
        analysis.header = JSON.parse(atob(parts[0]));
      } catch (_error) {
        analysis.issues.push('Impossible de décoder l\'en-tête JWT');
      }

      // Décoder le payload
      try {
        analysis.payload = JSON.parse(atob(parts[1])) as JWTPayload;
      } catch (_error) {
        analysis.issues.push('Impossible de décoder le payload JWT');
        return analysis;
      }

      // Extraire la signature
      analysis.signature = parts[2];

      // Analyser le payload
      if (analysis.payload) {
        // Vérifier les champs requis
        if (!analysis.payload.exp) {
          analysis.issues.push('Champ "exp" (expiration) manquant dans le token');
        } else {
          const exp = analysis.payload.exp as number;
          analysis.expiration = new Date(exp * 1000);
          const now = Math.floor(Date.now() / 1000);
          analysis.timeUntilExpiry = exp - now;
          analysis.isExpired = exp < now;
        }

        if (!analysis.payload.user_id && !analysis.payload.sub) {
          analysis.issues.push('Champ "user_id" ou "sub" manquant dans le token');
        }

        if (!analysis.payload.iat) {
          analysis.issues.push('Champ "iat" (issued at) manquant dans le token');
        }

        // Vérifier la durée de vie
        if (analysis.payload.iat && analysis.payload.exp) {
          const exp = analysis.payload.exp as number;
          const iat = analysis.payload.iat as number;
          const tokenLifetime = exp - iat;
          const expectedLifetime = 24 * 60 * 60; // 24 heures en secondes
          
          if (tokenLifetime < expectedLifetime * 0.9) { // 10% de tolérance
            analysis.issues.push(`Durée de vie du token anormalement courte: ${Math.floor(tokenLifetime / 60)} minutes au lieu de 24 heures`);
          }
        }

        // Vérifier l'horodatage
        if (analysis.payload.iat) {
          const iat = analysis.payload.iat as number;
          const issuedAt = new Date(iat * 1000);
          const now = new Date();
          const timeDiff = Math.abs(now.getTime() - issuedAt.getTime()) / 1000;
          
          if (timeDiff > 300) { // Plus de 5 minutes de différence
            analysis.issues.push(`Horodatage du token suspect: différence de ${Math.floor(timeDiff / 60)} minutes avec l'heure actuelle`);
          }
        }
      }

      // Vérifier l'algorithme
      if (analysis.header && analysis.header.alg) {
        if (analysis.header.alg !== 'HS256' && analysis.header.alg !== 'HS512') {
          analysis.issues.push(`Algorithme de signature non standard: ${analysis.header.alg}`);
        }
      }

      // Déterminer si le token est valide
      analysis.isValid = analysis.issues.length === 0;

      // Générer des recommandations
      if (analysis.isExpired) {
        analysis.recommendations.push('Token expiré: utilisez le refresh token pour obtenir un nouveau token');
      }

      if (analysis.timeUntilExpiry < 300) { // Moins de 5 minutes
        analysis.recommendations.push('Token expire bientôt: rafraîchissez-le maintenant');
      }

      if (analysis.issues.length > 0) {
        analysis.recommendations.push('Token invalide: reconnectez-vous pour obtenir un nouveau token');
      }

      if (analysis.isValid && !analysis.isExpired) {
        analysis.recommendations.push('Token valide: aucune action requise');
      }

    } catch (error) {
      analysis.issues.push(`Erreur lors de l'analyse: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    return analysis;
  }

  /**
   * Comparer deux tokens
   */
  public compareTokens(token1: string, token2: string): {
    areIdentical: boolean;
    differences: string[];
    analysis1: TokenAnalysis;
    analysis2: TokenAnalysis;
  } {
    const analysis1 = this.analyzeToken(token1);
    const analysis2 = this.analyzeToken(token2);
    const differences: string[] = [];

    // Comparer les payloads
    if (analysis1.payload && analysis2.payload) {
      if (analysis1.payload.user_id !== analysis2.payload.user_id) {
        differences.push('User ID différent');
      }
      if (analysis1.payload.exp !== analysis2.payload.exp) {
        differences.push('Date d\'expiration différente');
      }
      if (analysis1.payload.iat !== analysis2.payload.iat) {
        differences.push('Date d\'émission différente');
      }
    }

    // Comparer la validité
    if (analysis1.isValid !== analysis2.isValid) {
      differences.push('Validité différente');
    }

    // Comparer l'expiration
    if (analysis1.isExpired !== analysis2.isExpired) {
      differences.push('État d\'expiration différent');
    }

    return {
      areIdentical: differences.length === 0,
      differences,
      analysis1,
      analysis2
    };
  }

  /**
   * Générer un rapport de diagnostic complet
   */
  public generateDiagnosticReport(): {
    timestamp: string;
    tokens: {
      access: TokenAnalysis | null;
      refresh: string | null;
    };
    localStorage: {
      hasAccessToken: boolean;
      hasRefreshToken: boolean;
      hasUserData: boolean;
    };
    recommendations: string[];
  } {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user_data');

    const report = {
      timestamp: new Date().toISOString(),
      tokens: {
        access: accessToken ? this.analyzeToken(accessToken) : null,
        refresh: refreshToken
      },
      localStorage: {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData
      },
      recommendations: [] as string[]
    };

    // Analyser l'état général
    if (!accessToken) {
      report.recommendations.push('Aucun access token trouvé: connectez-vous');
    } else if (report.tokens.access) {
      if (report.tokens.access.isExpired) {
        report.recommendations.push('Access token expiré: utilisez le refresh token');
      } else if (report.tokens.access.timeUntilExpiry < 300) {
        report.recommendations.push('Access token expire bientôt: rafraîchissez-le');
      }
    }

    if (!refreshToken) {
      report.recommendations.push('Aucun refresh token trouvé: reconnectez-vous');
    }

    if (!userData) {
      report.recommendations.push('Aucune donnée utilisateur trouvée: reconnectez-vous');
    }

    return report;
  }

  /**
   * Tester la validité d'un token avec l'API
   */
  public async testTokenValidity(token: string): Promise<{
    isValid: boolean;
    status: number;
    response: any;
    error?: string;
  }> {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/arbitres/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          status: response.status,
          response: data
        };
      } else {
        return {
          isValid: false,
          status: response.status,
          response: null,
          error: response.statusText
        };
      }
    } catch (error) {
      return {
        isValid: false,
        status: 0,
        response: null,
        error: error instanceof Error ? error.message : 'Erreur de connexion'
      };
    }
  }
}

// Instance globale du service
export const tokenDiagnosticService = new TokenDiagnosticService();

// Fonctions utilitaires
export const analyzeToken = (token: string) => tokenDiagnosticService.analyzeToken(token);
export const generateReport = () => tokenDiagnosticService.generateDiagnosticReport();
export const testToken = (token: string) => tokenDiagnosticService.testTokenValidity(token);
