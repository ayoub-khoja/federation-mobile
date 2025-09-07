# Guide de résolution des problèmes - Notifications FCM

## Problème : "Les notifications push ne sont pas supportées par votre navigateur"

### Causes possibles et solutions

#### 1. **Contexte non sécurisé (HTTPS requis)**
- **Problème** : Les notifications push nécessitent HTTPS en production
- **Solution** : 
  - En production : Assurez-vous que votre site utilise HTTPS
  - En développement : Utilisez `localhost` ou `127.0.0.1` (HTTP autorisé)

#### 2. **Service Worker non enregistré correctement**
- **Problème** : Le service worker Firebase n'est pas enregistré
- **Solution** : 
  - Vérifiez que `firebase-messaging-sw.js` est accessible à `/firebase-messaging-sw.js`
  - Vérifiez la console pour les erreurs d'enregistrement du service worker

#### 3. **Configuration Firebase incorrecte**
- **Problème** : Les clés Firebase ne sont pas correctement configurées
- **Solution** :
  - Vérifiez les variables d'environnement Firebase
  - Assurez-vous que la clé VAPID est correcte

#### 4. **Navigateur non supporté**
- **Problème** : Le navigateur ne supporte pas les APIs nécessaires
- **Solution** :
  - Utilisez un navigateur moderne (Chrome, Firefox, Safari, Edge)
  - Vérifiez que JavaScript est activé

### Diagnostic automatique

Visitez `/test-fcm` pour un diagnostic complet qui vérifie :
- Support du Service Worker
- Support du Push Manager
- Support des Notifications
- Configuration Firebase
- Contexte sécurisé
- Permissions

### Solutions par plateforme

#### **Mobile (Android)**
```javascript
// Vérifier le support mobile
if ('serviceWorker' in navigator && 'PushManager' in window) {
  // FCM supporté
} else {
  // Utiliser les notifications natives Android
}
```

#### **Mobile (iOS)**
```javascript
// iOS nécessite une configuration spéciale
if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
  // Vérifier la version iOS (12+ requis)
  // Configurer APNs
}
```

#### **Desktop**
```javascript
// Vérifier le contexte sécurisé
if (window.isSecureContext) {
  // Notifications push supportées
} else {
  // Utiliser HTTP uniquement en localhost
}
```

### Configuration requise

#### **Variables d'environnement**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

#### **Service Worker**
- Fichier : `/public/firebase-messaging-sw.js`
- Scope : `/`
- Doit être accessible via HTTPS

#### **Manifeste PWA**
```json
{
  "name": "FTF Arbitrage",
  "short_name": "FTF",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#dc2626"
}
```

### Tests de validation

1. **Test de base** : Visitez `/test-fcm`
2. **Test de permission** : Cliquez sur "S'abonner"
3. **Test de notification** : Envoyez une notification de test
4. **Test mobile** : Testez sur un appareil mobile réel

### Messages d'erreur courants

#### "Firebase Messaging non initialisé"
- Vérifiez la configuration Firebase
- Vérifiez que le service worker est enregistré

#### "Permission refusée pour les notifications"
- L'utilisateur a refusé les permissions
- Demandez à l'utilisateur d'activer les notifications dans les paramètres du navigateur

#### "Impossible d'obtenir le token FCM"
- Vérifiez la clé VAPID
- Vérifiez la configuration Firebase
- Vérifiez que le service worker est actif

### Support des navigateurs

| Navigateur | Version minimale | Support FCM |
|------------|------------------|-------------|
| Chrome     | 50+              | ✅          |
| Firefox    | 44+              | ✅          |
| Safari     | 16+              | ✅          |
| Edge       | 17+              | ✅          |
| Mobile Chrome | 50+          | ✅          |
| Mobile Safari | 16+           | ✅          |

### Ressources utiles

- [Documentation Firebase FCM](https://firebase.google.com/docs/cloud-messaging)
- [Guide PWA](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
