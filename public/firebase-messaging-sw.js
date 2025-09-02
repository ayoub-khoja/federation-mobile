/**
 * Service Worker pour Firebase Cloud Messaging
 * Gère les notifications push en arrière-plan
 */

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuration Firebase (même que dans firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyB51FSdFZalgylYq677RlHGDT2o-iS4ifA",
  authDomain: "federation-16c7a.firebaseapp.com",
  projectId: "federation-16c7a",
  storageBucket: "federation-16c7a.firebasestorage.app",
  messagingSenderId: "865044602349",
  appId: "1:865044602349:web:1ca0086e1512f626171be4"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Messaging
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 Message FCM reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification?.title || 'Nouvelle notification';
  const notificationOptions = {
    body: payload.notification?.body || 'Vous avez reçu une nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.match_id || 'default',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer',
        icon: '/icon-192x192.png'
      }
    ]
  };

  // Afficher la notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification cliquée:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Ouvrir l'application ou rediriger vers une page spécifique
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si une fenêtre de l'app est déjà ouverte, la mettre au premier plan
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Gérer les fermetures de notifications
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Notification fermée:', event);
  
  // Ici vous pouvez envoyer des analytics ou des métriques
  // sur les notifications fermées
});