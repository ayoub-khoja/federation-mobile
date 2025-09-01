
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
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Ouvrir l'application ou la page spécifique
    const urlToOpen = event.notification.data.action_url || '/home';
    
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  } else if (event.action === 'dismiss') {
    // Notification fermée, rien à faire
    console.log('❌ Notification fermée');
  } else {
    // Clic sur la notification principale
    const urlToOpen = event.notification.data.action_url || '/home';
    
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('❌ Erreur du service worker:', event.error);
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('📨 Message reçu du client:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
