/**
 * Script de test spécifique pour iOS FCM
 * Usage: node scripts/test-ios-fcm.js
 */

const fs = require('fs');

console.log('🍎 Test de compatibilité iOS FCM...\n');

// Vérifier les fichiers modifiés
const modifiedFiles = [
  'src/config/firebase.ts',
  'src/hooks/useFCMNotifications.ts',
  'src/components/FCMTest.tsx',
  'src/components/PushNotificationManager.tsx'
];

console.log('📁 Vérification des fichiers modifiés:');
modifiedFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier la détection iOS Safari
console.log('\n🍎 Vérification de la détection iOS Safari:');
try {
  const firebaseConfig = fs.readFileSync('src/config/firebase.ts', 'utf8');
  
  const iosChecks = [
    { name: 'Détection iOS', pattern: /iPhone|iPad|iPod/i },
    { name: 'Détection Safari', pattern: /Safari.*Chrome/i },
    { name: 'Blocage iOS Safari', pattern: /iOS Safari ne supporte pas/ },
    { name: 'Recommandation Chrome', pattern: /Chrome ou Firefox sur iOS/ }
  ];
  
  iosChecks.forEach(check => {
    const found = check.pattern.test(firebaseConfig);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire firebase.ts');
}

// Vérifier le hook FCM
console.log('\n🎣 Vérification du hook FCM iOS:');
try {
  const hookFile = fs.readFileSync('src/hooks/useFCMNotifications.ts', 'utf8');
  
  const hookChecks = [
    { name: 'Détection iOS', pattern: /isIOS/ },
    { name: 'Détection Safari', pattern: /isSafari/ },
    { name: 'Message iOS Safari', pattern: /iOS Safari ne supporte pas/ },
    { name: 'Recommandation navigateur', pattern: /Chrome ou Firefox sur iOS/ }
  ];
  
  hookChecks.forEach(check => {
    const found = check.pattern.test(hookFile);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire useFCMNotifications.ts');
}

// Vérifier le composant FCMTest
console.log('\n🧪 Vérification du composant FCMTest iOS:');
try {
  const testFile = fs.readFileSync('src/components/FCMTest.tsx', 'utf8');
  
  const testChecks = [
    { name: 'Détection iOS Safari', pattern: /iPhone.*iPad.*iPod.*Safari.*Chrome/ },
    { name: 'Message iOS Safari', pattern: /iOS Safari détecté/ },
    { name: 'Instructions Chrome', pattern: /Téléchargez Chrome ou Firefox/ },
    { name: 'Instructions App Store', pattern: /App Store/ }
  ];
  
  testChecks.forEach(check => {
    const found = check.pattern.test(testFile);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire FCMTest.tsx');
}

// Vérifier le composant PushNotificationManager
console.log('\n🔔 Vérification du composant PushNotificationManager iOS:');
try {
  const managerFile = fs.readFileSync('src/components/PushNotificationManager.tsx', 'utf8');
  
  const managerChecks = [
    { name: 'Détection iOS Safari', pattern: /isIOS.*isSafari/ },
    { name: 'Message conditionnel', pattern: /iOS Safari ne supporte pas/ },
    { name: 'Instructions Chrome', pattern: /Téléchargez Chrome ou Firefox/ },
    { name: 'Détails techniques iOS', pattern: /iOS Safari.*✅.*❌/ }
  ];
  
  managerChecks.forEach(check => {
    const found = check.pattern.test(managerFile);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire PushNotificationManager.tsx');
}

console.log('\n🍎 Problème iOS Safari expliqué:');
console.log('  • iOS Safari ne supporte pas les Service Workers de la même manière');
console.log('  • Les APIs PushManager et Notification ne sont pas disponibles');
console.log('  • Firebase FCM nécessite ces APIs pour fonctionner');
console.log('  • Chrome et Firefox sur iOS utilisent le moteur WebKit mais avec des APIs étendues');

console.log('\n📱 Solutions pour iOS:');
console.log('  1. Téléchargez Chrome ou Firefox sur l\'App Store');
console.log('  2. Ouvrez https://federation-mobile.vercel.app/test-fcm dans Chrome/Firefox');
console.log('  3. Activez les notifications dans les paramètres du navigateur');
console.log('  4. Testez l\'abonnement aux notifications');

console.log('\n🔍 Test sur iOS:');
console.log('  1. Ouvrez Safari sur votre iPhone');
console.log('  2. Allez sur https://federation-mobile.vercel.app/test-fcm');
console.log('  3. Vérifiez que le message iOS Safari s\'affiche');
console.log('  4. Téléchargez Chrome ou Firefox');
console.log('  5. Testez dans Chrome/Firefox');

console.log('\n✅ Résultat attendu:');
console.log('  • Safari : Message "iOS Safari ne supporte pas les notifications push"');
console.log('  • Chrome/Firefox : Notifications push fonctionnelles');
console.log('  • Boutons d\'abonnement visibles dans Chrome/Firefox');
console.log('  • Diagnostic complet dans les deux navigateurs');
