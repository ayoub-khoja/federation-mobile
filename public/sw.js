// Service Worker pour PWA - Version simplifiée
const CACHE_NAME = 'federation-pwa-v1';
const urlsToCache = [
  '/',
  '/home',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cache ouvert');
        // Ajouter seulement les URLs essentielles
        return cache.addAll(urlsToCache).catch((error) => {
          console.warn('⚠️ Service Worker: Certaines URLs ne peuvent pas être mises en cache:', error);
          return Promise.resolve();
        });
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes API
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Ignorer les requêtes Next.js internes
  if (event.request.url.includes('/_next/')) {
    return;
  }

  // Stratégie cache-first pour les autres ressources
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request).catch(() => {
          // En cas d'échec réseau, retourner une page d'erreur simple
          if (event.request.destination === 'document') {
            return new Response(
              '<html><body><h1>Hors ligne</h1><p>Veuillez vérifier votre connexion internet.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          }
        });
      })
  );
});

// Gestion des notifications push (basique)
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Notification push reçue');
  
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'Nouvelle notification',
        icon: '/cartons.png',
        badge: '/cartons.png',
        tag: 'federation-notification',
        requireInteraction: true
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Fédération Tunisienne de Football', options)
      );
    } catch (error) {
      console.error('❌ Service Worker: Erreur lors du traitement de la notification:', error);
    }
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notification cliquée');
  
  event.notification.close();
  
  // Ouvrir l'application
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker: Erreur:', event.error);
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
