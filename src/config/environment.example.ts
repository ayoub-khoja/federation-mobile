/**
 * Exemple de configuration des variables d'environnement
 * Copiez ce fichier vers environment.ts et remplissez vos vraies valeurs
 */

export const ENVIRONMENT_CONFIG_EXAMPLE = {
  // Clés VAPID pour les notifications push
  VAPID: {
    PUBLIC_KEY: 'votre_cle_publique_vapid_ici',
    PRIVATE_KEY: 'votre_cle_privee_vapid_ici', // Ne pas exposer côté client
  },
  
  // URL de l'API backend
  API: {
    BASE_URL: 'http://localhost:8000/api',
    TIMEOUT: 10000,
  },
  
  // Configuration des notifications
  NOTIFICATIONS: {
    TITLE: 'FTF Arbitrage',
    ICON: '/ftf-logo.png',
    BADGE: '/ftf-logo.png',
    AUTO_CLOSE_DELAY: 5000,
  },
  
  // Configuration du service worker
  SERVICE_WORKER: {
    SCOPE: '/',
    FILE: '/sw.js',
  },
  
  // Mode de développement
  DEVELOPMENT: {
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
};

// Instructions d'utilisation :
// 1. Copiez ce fichier vers environment.ts
// 2. Remplacez les valeurs d'exemple par vos vraies valeurs
// 3. Pour les clés VAPID, utilisez : web-push generate-vapid-keys
// 4. Assurez-vous que votre backend Django est configuré pour les notifications push
