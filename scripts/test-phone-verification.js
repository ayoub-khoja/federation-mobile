#!/usr/bin/env node

/**
 * Script de test pour l'API de vérification du téléphone
 * Usage: node scripts/test-phone-verification.js [--local|--production]
 */

const https = require('https');
const http = require('http');

// Configuration des environnements
const environments = {
  local: {
    name: 'Local',
    baseUrl: 'http://localhost:8000',
    frontendUrl: 'http://localhost:3000'
  },
  production: {
    name: 'Production',
    baseUrl: 'https://federation-backend.onrender.com',
    frontendUrl: 'https://federation-mobile-front.vercel.app'
  }
};

// Déterminer l'environnement
const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const isProduction = args.includes('--production');
const environment = isLocal ? environments.local : environments.production;

console.log(`🧪 Test de l'API de vérification du téléphone - ${environment.name}`);
console.log(`📡 Backend: ${environment.baseUrl}`);
console.log(`🌐 Frontend: ${environment.frontendUrl}`);
console.log('─'.repeat(60));

// Numéros de test
const testPhones = [
  '+21612345678', // Numéro de test
  '+21698765432', // Autre numéro de test
  '+21600000000'  // Numéro invalide probablement
];

// Fonction pour faire une requête HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test de l'API de vérification
async function testPhoneVerification() {
  console.log('\n📞 Test de l\'API /accounts/verify-phone/');
  console.log('─'.repeat(40));
  
  for (const phone of testPhones) {
    try {
      console.log(`\n🔍 Test avec le numéro: ${phone}`);
      
      const url = `${environment.baseUrl}/api/accounts/verify-phone/`;
      const response = await makeRequest(url, {
        body: {
          phone_number: phone
        }
      });
      
      console.log(`📡 Status: ${response.status} ${response.statusText}`);
      console.log(`📄 Réponse:`, JSON.stringify(response.data, null, 2));
      
      if (response.status === 200) {
        console.log('✅ Succès');
      } else if (response.status === 404) {
        console.log('❌ Endpoint non trouvé');
      } else {
        console.log('⚠️ Erreur API');
      }
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Test de la route frontend
async function testFrontendRoute() {
  console.log('\n🌐 Test de la route frontend');
  console.log('─'.repeat(40));
  
  try {
    console.log(`🔍 Test de ${environment.frontendUrl}/api/accounts/verify-phone/`);
    
    const url = `${environment.frontendUrl}/api/accounts/verify-phone/`;
    const response = await makeRequest(url, {
      body: {
        phone_number: '+21612345678'
      }
    });
    
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Réponse:`, JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('✅ Route frontend fonctionne');
    } else if (response.status === 404) {
      console.log('❌ Route frontend non configurée');
    } else {
      console.log('⚠️ Erreur route frontend');
    }
    
  } catch (error) {
    console.log(`❌ Erreur route frontend: ${error.message}`);
  }
}

// Test de connectivité générale
async function testConnectivity() {
  console.log('\n🌍 Test de connectivité');
  console.log('─'.repeat(40));
  
  try {
    const url = `${environment.baseUrl}/api/`;
    const response = await makeRequest(url, {
      method: 'GET'
    });
    
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200 || response.status === 404) {
      console.log('✅ Backend accessible');
    } else {
      console.log('⚠️ Backend accessible mais erreur');
    }
    
  } catch (error) {
    console.log(`❌ Backend inaccessible: ${error.message}`);
  }
}

// Exécution des tests
async function runTests() {
  try {
    await testConnectivity();
    await testPhoneVerification();
    
    if (!isLocal) {
      await testFrontendRoute();
    }
    
    console.log('\n🎉 Tests terminés');
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Aide
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/test-phone-verification.js [options]

Options:
  --local       Tester l'environnement local
  --production  Tester l'environnement de production
  --help, -h    Afficher cette aide

Exemples:
  node scripts/test-phone-verification.js --local
  node scripts/test-phone-verification.js --production
  `);
  process.exit(0);
}

// Lancer les tests
runTests();
