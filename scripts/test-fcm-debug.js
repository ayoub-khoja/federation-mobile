/**
 * Script de diagnostic avancé pour FCM
 * Usage: node scripts/test-fcm-debug.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic avancé FCM...\n');

// Vérifier les fichiers requis
const requiredFiles = [
  'public/firebase-messaging-sw.js',
  'src/config/firebase.ts',
  'src/hooks/useFCMNotifications.ts',
  'src/components/PushNotificationManager.tsx',
  'src/components/ServiceWorkerRegistration.tsx'
];

console.log('📁 Vérification des fichiers requis:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier le contenu du service worker
console.log('\n🔧 Vérification du service worker Firebase:');
try {
  const swContent = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');
  
  const checks = [
    { name: 'Import Firebase v10+', pattern: /firebasejs\/10\./ },
    { name: 'Configuration Firebase', pattern: /firebaseConfig/ },
    { name: 'Initialisation Firebase', pattern: /firebase\.initializeApp/ },
    { name: 'Gestion des messages', pattern: /onBackgroundMessage/ },
    { name: 'Gestion des clics', pattern: /notificationclick/ },
    { name: 'Gestion des fermetures', pattern: /notificationclose/ }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(swContent);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire le service worker');
}

// Vérifier la configuration Firebase
console.log('\n⚙️ Vérification de la configuration Firebase:');
try {
  const firebaseConfig = fs.readFileSync('src/config/firebase.ts', 'utf8');
  
  const checks = [
    { name: 'Import Firebase v10+', pattern: /from 'firebase\/app'/ },
    { name: 'Import Messaging', pattern: /from 'firebase\/messaging'/ },
    { name: 'Configuration', pattern: /firebaseConfig/ },
    { name: 'Initialisation', pattern: /initializeApp/ },
    { name: 'Messaging', pattern: /getMessaging/ },
    { name: 'Fonction getFCMToken', pattern: /getFCMToken/ },
    { name: 'Fonction isFCMSupported', pattern: /isFCMSupported/ },
    { name: 'Vérification contexte sécurisé', pattern: /isSecureContext/ }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(firebaseConfig);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire la configuration Firebase');
}

// Vérifier les variables d'environnement
console.log('\n🌍 Vérification des variables d\'environnement:');
const envVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID_WEB',
  'NEXT_PUBLIC_FIREBASE_VAPID_KEY'
];

envVars.forEach(envVar => {
  const value = process.env[envVar];
  const exists = value && value !== 'your-api-key' && value !== 'your-vapid-key';
  console.log(`  ${exists ? '✅' : '❌'} ${envVar}`);
});

// Vérifier le manifeste PWA
console.log('\n📱 Vérification du manifeste PWA:');
try {
  const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
  
  const requiredFields = ['name', 'short_name', 'start_url', 'display'];
  requiredFields.forEach(field => {
    const exists = manifest[field];
    console.log(`  ${exists ? '✅' : '❌'} ${field}: ${manifest[field] || 'manquant'}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire le manifeste PWA');
}

// Vérifier la configuration Next.js
console.log('\n⚡ Vérification de la configuration Next.js:');
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  const checks = [
    { name: 'Configuration PWA', pattern: /pwa|manifest/ },
    { name: 'Headers de sécurité', pattern: /headers/ },
    { name: 'Configuration HTTPS', pattern: /https/ },
    { name: 'Configuration Service Worker', pattern: /sw\.js/ }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(nextConfig);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire la configuration Next.js');
}

// Vérifier les conflits de service workers
console.log('\n🔄 Vérification des conflits de service workers:');
const swFiles = [
  'public/sw.js',
  'public/firebase-messaging-sw.js'
];

swFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '⚠️' : '✅'} ${file} ${exists ? '(peut causer des conflits)' : '(OK)'}`);
});

console.log('\n🎯 Instructions de test:');
console.log('  1. Redémarrez votre serveur de développement');
console.log('  2. Ouvrez les outils de développement (F12)');
console.log('  3. Allez dans l\'onglet "Application" > "Service Workers"');
console.log('  4. Vérifiez que seul firebase-messaging-sw.js est enregistré');
console.log('  5. Visitez /test-fcm pour un test interactif');
console.log('  6. Testez sur localhost (HTTP autorisé) ou HTTPS');

console.log('\n📚 Solutions aux problèmes courants:');
console.log('  • Si "Service Worker: ❌" → Vérifiez que le navigateur supporte les SW');
console.log('  • Si "Push Manager: ❌" → Utilisez un navigateur moderne');
console.log('  • Si "Notifications: ❌" → Activez les notifications dans le navigateur');
console.log('  • Si "Contexte sécurisé: ❌" → Utilisez HTTPS ou localhost');
console.log('  • Si "Firebase: ❌" → Vérifiez la configuration Firebase');

console.log('\n🔧 Commandes utiles:');
console.log('  npm run dev          # Démarrer en développement');
console.log('  npm run build        # Construire pour la production');
console.log('  npm run start        # Démarrer en production');
