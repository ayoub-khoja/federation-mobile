
// ============================================================================
// FORMAT VAPID CORRIGÉ - 2025-08-31 20:02:17
// Nouvelle clé publique: BDpgiiNfAzMtRqsTFxRI...
// Format: DER brut (pas PEM)
// ============================================================================

// ============================================================================
// MISE À JOUR FORCÉE VAPID - 2025-08-31 19:59:55
// Nouvelle clé publique: BCikKqO_UURWM1uLZvHB...
// ============================================================================
// Service Worker pour les notifications push
const CACHE_NAME = 'louvre-pwa-v1';
const urlsToCache = [
  '/',
  '/home',
  '/profile',
  '/designations'
];

// Déterminer l'environnement
const isProduction = self.location.hostname === 'federation-mobile-front.vercel.app';
const isLocalhost = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  // Gérer les requêtes API différemment selon l'environnement
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // En cas d'échec, essayer de récupérer depuis le cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Pour les autres ressources, utiliser la stratégie cache-first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request);
      }
    )
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('🔔 Notification push reçue:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/cartons.png',
      badge: data.badge || '/cartons.png',
      tag: data.tag || 'default',
      data: data.data || {},
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Voir',
          icon: '/cartons.png'
        },
        {
          action: 'dismiss',
          title: 'Fermer'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification cliquée:', event);
  
  if (event.action === 'view') {
    // Ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Fermer la notification
    event.notification.close();
  } else {
    // Action par défaut : ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('❌ Erreur du service worker:', event.error);
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
