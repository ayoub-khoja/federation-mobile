/**
 * Script de test pour vérifier la configuration FCM
 * Usage: node scripts/test-fcm-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test de la configuration FCM...\n');

// Vérifier les fichiers requis
const requiredFiles = [
  'public/firebase-messaging-sw.js',
  'src/config/firebase.ts',
  'src/hooks/useFCMNotifications.ts',
  'src/components/PushNotificationManager.tsx'
];

console.log('📁 Vérification des fichiers requis:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier le contenu du service worker
console.log('\n🔧 Vérification du service worker:');
try {
  const swContent = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');
  
  const checks = [
    { name: 'Import Firebase', pattern: /importScripts.*firebase/ },
    { name: 'Configuration Firebase', pattern: /firebaseConfig/ },
    { name: 'Initialisation Firebase', pattern: /firebase\.initializeApp/ },
    { name: 'Gestion des messages', pattern: /onBackgroundMessage/ },
    { name: 'Gestion des clics', pattern: /notificationclick/ }
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
    { name: 'Import Firebase', pattern: /import.*firebase/ },
    { name: 'Configuration', pattern: /firebaseConfig/ },
    { name: 'Initialisation', pattern: /initializeApp/ },
    { name: 'Messaging', pattern: /getMessaging/ },
    { name: 'Fonction getFCMToken', pattern: /getFCMToken/ },
    { name: 'Fonction isFCMSupported', pattern: /isFCMSupported/ }
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
  'NEXT_PUBLIC_FIREBASE_APP_ID',
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
    { name: 'Configuration HTTPS', pattern: /https/ }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(nextConfig);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire la configuration Next.js');
}

console.log('\n🎯 Résumé:');
console.log('  - Visitez /test-fcm pour un test interactif');
console.log('  - Vérifiez la console du navigateur pour les erreurs');
console.log('  - Testez sur un appareil mobile réel');
console.log('  - Assurez-vous d\'utiliser HTTPS en production');

console.log('\n📚 Documentation:');
console.log('  - Guide de résolution: FCM_TROUBLESHOOTING.md');
console.log('  - Configuration Firebase: FIREBASE_SETUP_GUIDE.md');
console.log('  - Configuration mobile: MOBILE_APPS_SETUP.md');
