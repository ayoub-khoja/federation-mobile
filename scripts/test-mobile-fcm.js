/**
 * Script de test spécifique pour mobile FCM
 * Usage: node scripts/test-mobile-fcm.js
 */

const fs = require('fs');

console.log('📱 Test de compatibilité mobile FCM...\n');

// Vérifier les fichiers requis
const requiredFiles = [
  'public/firebase-messaging-sw.js',
  'src/config/firebase.ts',
  'src/hooks/useFCMNotifications.ts',
  'src/components/MobileFCMDiagnostic.tsx',
  'src/components/FCMTest.tsx'
];

console.log('📁 Vérification des fichiers requis:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier la configuration mobile
console.log('\n📱 Vérification de la configuration mobile:');
try {
  const firebaseConfig = fs.readFileSync('src/config/firebase.ts', 'utf8');
  
  const mobileChecks = [
    { name: 'Détection mobile', pattern: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i },
    { name: 'Vérification iOS', pattern: /iOS.*version/i },
    { name: 'Vérification Android', pattern: /Android.*version/i },
    { name: 'PushManager mobile', pattern: /ServiceWorkerRegistration\.prototype/ },
    { name: 'Contexte sécurisé', pattern: /isSecureContext/ }
  ];
  
  mobileChecks.forEach(check => {
    const found = check.pattern.test(firebaseConfig);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire la configuration Firebase');
}

// Vérifier le composant de diagnostic mobile
console.log('\n🔍 Vérification du diagnostic mobile:');
try {
  const diagnosticFile = fs.readFileSync('src/components/MobileFCMDiagnostic.tsx', 'utf8');
  
  const diagnosticChecks = [
    { name: 'Détection navigateur', pattern: /Chrome|Firefox|Safari|Edge/ },
    { name: 'Détection OS', pattern: /Android|iOS|iPadOS/ },
    { name: 'Vérification APIs', pattern: /PushManager|Notification|serviceWorker/ },
    { name: 'Recommandations', pattern: /Recommandations/ },
    { name: 'User Agent', pattern: /userAgent/ }
  ];
  
  diagnosticChecks.forEach(check => {
    const found = check.pattern.test(diagnosticFile);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire le composant de diagnostic mobile');
}

// Vérifier le service worker
console.log('\n⚙️ Vérification du service worker:');
try {
  const swContent = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');
  
  const swChecks = [
    { name: 'Version Firebase 10+', pattern: /firebasejs\/10\./ },
    { name: 'Gestion mobile', pattern: /onBackgroundMessage/ },
    { name: 'Notifications mobiles', pattern: /showNotification/ },
    { name: 'Gestion des clics', pattern: /notificationclick/ }
  ];
  
  swChecks.forEach(check => {
    const found = check.pattern.test(swContent);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire le service worker');
}

console.log('\n🎯 Instructions de test mobile:');
console.log('  1. Déployez votre application sur Vercel');
console.log('  2. Ouvrez l\'URL sur votre téléphone');
console.log('  3. Visitez /test-fcm pour le diagnostic complet');
console.log('  4. Vérifiez les détails techniques');

console.log('\n📱 Navigateurs mobiles supportés:');
console.log('  • Chrome Mobile 50+ (Android)');
console.log('  • Firefox Mobile 44+ (Android)');
console.log('  • Safari 16+ (iOS)');
console.log('  • Edge Mobile (Android)');

console.log('\n⚠️ Problèmes courants sur mobile:');
console.log('  • Push Manager ❌ → Utilisez Chrome ou Firefox récent');
console.log('  • Notifications ❌ → Activez les notifications dans les paramètres');
console.log('  • Service Worker ❌ → Navigateur trop ancien');
console.log('  • Contexte sécurisé ❌ → Utilisez HTTPS');

console.log('\n🔧 Solutions:');
console.log('  • Mettez à jour votre navigateur mobile');
console.log('  • Activez les notifications dans les paramètres');
console.log('  • Utilisez Chrome ou Firefox sur Android');
console.log('  • Utilisez Safari 16+ sur iOS');

console.log('\n📚 Ressources:');
console.log('  • Test: https://federation-mobile.vercel.app/test-fcm');
console.log('  • Diagnostic: Composant MobileFCMDiagnostic');
console.log('  • Logs: Console du navigateur mobile');
