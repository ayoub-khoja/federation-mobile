#!/usr/bin/env node

/**
 * Script de test des API pour vérifier le fonctionnement en local et production
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  local: {
    baseUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:8000'
  },
  production: {
    baseUrl: 'https://federation-frontend.vercel.app',
    backendUrl: 'https://federation-backend.onrender.com'
  }
};

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Fonction pour faire des requêtes HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 10000
    };

    const req = client.request(url, requestOptions, (res) => {
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
        } catch (e) {
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

// Tests des API
const API_TESTS = [
  {
    name: 'Test de connectivité Next.js',
    endpoint: '/api/test',
    method: 'GET',
    requiresAuth: false
  },
  {
    name: 'Health Check des API',
    endpoint: '/api/health-check',
    method: 'GET',
    requiresAuth: false
  },
  {
    name: 'Test de connectivité Backend',
    endpoint: '/api/test',
    method: 'GET',
    requiresAuth: false,
    testBackend: true
  }
];

// Fonction pour tester une API
async function testAPI(baseUrl, test, authToken = null) {
  const url = `${baseUrl}${test.endpoint}`;
  const options = {
    method: test.method
  };

  if (test.requiresAuth && authToken) {
    options.headers = {
      'Authorization': `Bearer ${authToken}`
    };
  }

  if (test.body) {
    options.body = test.body;
  }

  try {
    console.log(`  ${colors.cyan}→${colors.reset} ${test.method} ${test.endpoint}`);
    
    const response = await makeRequest(url, options);
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`  ${colors.green}✅${colors.reset} ${response.status} ${response.statusText}`);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } else {
      console.log(`  ${colors.red}❌${colors.reset} ${response.status} ${response.statusText}`);
      return {
        success: false,
        status: response.status,
        error: response.data
      };
    }
  } catch (error) {
    console.log(`  ${colors.red}❌${colors.reset} ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Fonction pour tester un environnement
async function testEnvironment(envName, config) {
  console.log(`\n${colors.bright}${colors.blue}🌐 Test de l'environnement: ${envName.toUpperCase()}${colors.reset}`);
  console.log(`${colors.cyan}URL Frontend:${colors.reset} ${config.baseUrl}`);
  console.log(`${colors.cyan}URL Backend:${colors.reset} ${config.backendUrl}`);
  
  const results = {
    environment: envName,
    total: 0,
    success: 0,
    error: 0,
    tests: []
  };

  for (const test of API_TESTS) {
    console.log(`\n${colors.yellow}🧪 ${test.name}${colors.reset}`);
    results.total++;
    
    const result = await testAPI(config.baseUrl, test);
    results.tests.push({
      name: test.name,
      endpoint: test.endpoint,
      ...result
    });

    if (result.success) {
      results.success++;
    } else {
      results.error++;
    }
  }

  return results;
}

// Fonction pour générer un rapport
function generateReport(allResults) {
  console.log(`\n${colors.bright}${colors.magenta}📊 RAPPORT FINAL${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

  for (const result of allResults) {
    console.log(`\n${colors.bright}${colors.blue}${result.environment.toUpperCase()}${colors.reset}`);
    console.log(`  Total: ${result.total}`);
    console.log(`  ${colors.green}Succès: ${result.success}${colors.reset}`);
    console.log(`  ${colors.red}Erreurs: ${result.error}${colors.reset}`);
    
    if (result.error > 0) {
      console.log(`\n  ${colors.red}❌ Tests échoués:${colors.reset}`);
      result.tests
        .filter(t => !t.success)
        .forEach(t => {
          console.log(`    - ${t.name}: ${t.error || t.status}`);
        });
    }
  }

  // Sauvegarder le rapport
  const reportPath = path.join(__dirname, 'api-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\n${colors.green}📄 Rapport sauvegardé: ${reportPath}${colors.reset}`);
}

// Fonction principale
async function main() {
  console.log(`${colors.bright}${colors.cyan}🚀 Début des tests des API${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

  const allResults = [];

  // Test en local
  try {
    const localResults = await testEnvironment('local', CONFIG.local);
    allResults.push(localResults);
  } catch (error) {
    console.log(`${colors.red}❌ Erreur lors du test local: ${error.message}${colors.reset}`);
  }

  // Test en production
  try {
    const prodResults = await testEnvironment('production', CONFIG.production);
    allResults.push(prodResults);
  } catch (error) {
    console.log(`${colors.red}❌ Erreur lors du test production: ${error.message}${colors.reset}`);
  }

  // Générer le rapport
  generateReport(allResults);

  // Code de sortie
  const hasErrors = allResults.some(r => r.error > 0);
  process.exit(hasErrors ? 1 : 0);
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${colors.bright}Test des API - Fédération Tunisienne de Football${colors.reset}

Usage: node test-apis.js [options]

Options:
  --help, -h     Afficher cette aide
  --local        Tester seulement l'environnement local
  --production   Tester seulement l'environnement production

Exemples:
  node test-apis.js                    # Tester tous les environnements
  node test-apis.js --local            # Tester seulement le local
  node test-apis.js --production       # Tester seulement la production
`);
  process.exit(0);
}

// Exécuter les tests selon les arguments
if (args.includes('--local')) {
  testEnvironment('local', CONFIG.local).then(result => generateReport([result]));
} else if (args.includes('--production')) {
  testEnvironment('production', CONFIG.production).then(result => generateReport([result]));
} else {
  main();
}
