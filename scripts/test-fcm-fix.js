/**
 * Script de test pour vérifier les corrections FCM
 * Usage: node scripts/test-fcm-fix.js
 */

const fs = require('fs');

console.log('🔧 Test des corrections FCM...\n');

// Vérifier les fichiers modifiés
const modifiedFiles = [
  'src/components/FCMTest.tsx',
  'src/hooks/useFCMNotifications.ts',
  'src/app/test-fcm/page.tsx',
  'src/config/firebase.ts'
];

console.log('📁 Vérification des fichiers modifiés:');
modifiedFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier les corrections SSR
console.log('\n🔄 Vérification des corrections SSR:');
try {
  const fcmTest = fs.readFileSync('src/components/FCMTest.tsx', 'utf8');
  
  const ssrChecks = [
    { name: 'Vérification window', pattern: /typeof window === 'undefined'/ },
    { name: 'Protection SSR', pattern: /if \(typeof window === 'undefined'\) return/ },
    { name: 'Import statique', pattern: /import.*from/ },
    { name: 'Pas d\'import dynamique', pattern: /import\(/ }
  ];
  
  ssrChecks.forEach(check => {
    const found = check.pattern.test(fcmTest);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire FCMTest.tsx');
}

// Vérifier les corrections du hook
console.log('\n🎣 Vérification du hook FCM:');
try {
  const hookFile = fs.readFileSync('src/hooks/useFCMNotifications.ts', 'utf8');
  
  const hookChecks = [
    { name: 'Protection SSR', pattern: /if \(typeof window === 'undefined'\) return/ },
    { name: 'Détection mobile', pattern: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/ },
    { name: 'PushManager mobile', pattern: /ServiceWorkerRegistration\.prototype/ },
    { name: 'Gestion d\'erreur', pattern: /errorMessage/ }
  ];
  
  hookChecks.forEach(check => {
    const found = check.pattern.test(hookFile);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire useFCMNotifications.ts');
}

// Vérifier la page de test
console.log('\n📄 Vérification de la page de test:');
try {
  const pageFile = fs.readFileSync('src/app/test-fcm/page.tsx', 'utf8');
  
  const pageChecks = [
    { name: 'Directive client', pattern: /"use client"/ },
    { name: 'Import FCMTest', pattern: /import.*FCMTest/ },
    { name: 'Structure de base', pattern: /min-h-screen/ }
  ];
  
  pageChecks.forEach(check => {
    const found = check.pattern.test(pageFile);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Impossible de lire test-fcm/page.tsx');
}

console.log('\n🎯 Instructions de test:');
console.log('  1. Redéployez votre application sur Vercel');
console.log('  2. Attendez que le déploiement soit terminé');
console.log('  3. Visitez https://federation-mobile.vercel.app/test-fcm');
console.log('  4. Vérifiez que la page se charge sans erreur');
console.log('  5. Testez les notifications sur votre mobile');

console.log('\n📱 Test sur mobile:');
console.log('  • Ouvrez Chrome ou Firefox sur votre téléphone');
console.log('  • Allez sur https://federation-mobile.vercel.app/test-fcm');
console.log('  • Vérifiez que le diagnostic s\'affiche correctement');
console.log('  • Testez l\'abonnement aux notifications');

console.log('\n🔍 Vérifications à faire:');
console.log('  • La page se charge sans erreur "Application error"');
console.log('  • Le diagnostic mobile s\'affiche');
console.log('  • Les détails techniques sont corrects');
console.log('  • Les boutons d\'action fonctionnent');

console.log('\n⚠️ Si le problème persiste:');
console.log('  • Vérifiez la console du navigateur pour les erreurs');
console.log('  • Assurez-vous que le déploiement est terminé');
console.log('  • Testez sur un autre navigateur');
console.log('  • Vérifiez que HTTPS est bien activé');
