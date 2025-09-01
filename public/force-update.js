// Script pour forcer la mise à jour du service worker et du cache
// À exécuter dans la console du navigateur

console.log('🚀 FORCE UPDATE DU SERVICE WORKER ET DU CACHE');

// 1. Forcer la mise à jour du service worker
if ('serviceWorker' in navigator) {
    console.log('📱 Service Worker supporté');
    
    // Désactiver tous les service workers existants
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            console.log('🗑️ Suppression du service worker:', registration);
            registration.unregister();
        }
        
        // Attendre un peu puis réenregistrer
        setTimeout(() => {
            console.log('🔄 Réenregistrement du service worker...');
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('✅ Service Worker réenregistré:', registration);
                    
                    // Forcer l'activation
                    if (registration.waiting) {
                        registration.waiting.postMessage({type: 'SKIP_WAITING'});
                    }
                    
                    // Vérifier l'état
                    console.log('📊 État du service worker:', registration.active ? 'Actif' : 'En attente');
                })
                .catch(function(error) {
                    console.error('❌ Erreur lors du réenregistrement:', error);
                });
        }, 1000);
    });
} else {
    console.log('❌ Service Worker non supporté');
}

// 2. Vider le cache du navigateur
if ('caches' in window) {
    console.log('🗑️ Vidage du cache...');
    caches.keys().then(function(names) {
        for (let name of names) {
            console.log('🗑️ Suppression du cache:', name);
            caches.delete(name);
        }
        console.log('✅ Cache vidé');
    });
} else {
    console.log('❌ Cache API non supportée');
}

// 3. Forcer le rechargement de la page
console.log('🔄 Rechargement de la page dans 3 secondes...');
setTimeout(() => {
    console.log('🔄 Rechargement...');
    window.location.reload(true);
}, 3000);

// 4. Instructions pour l'utilisateur
console.log(`
🚨 INSTRUCTIONS IMPORTANTES:
1. Attendez que la page se recharge automatiquement
2. Acceptez les notifications push quand le navigateur le demande
3. Les nouvelles clés VAPID seront utilisées
4. Plus d'erreur "applicationServerKey is not valid"
`);
