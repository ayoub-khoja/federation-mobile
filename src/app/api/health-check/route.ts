import { NextRequest, NextResponse } from 'next/server';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

interface ApiTest {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  requiresAuth?: boolean;
  testData?: any;
}

const API_TESTS: ApiTest[] = [
  // Test de base
  {
    name: 'Test de connectivité',
    endpoint: '/test',
    method: 'GET'
  },
  
  // API Excuses
  {
    name: 'Historique des excuses',
    endpoint: '/excuses/history',
    method: 'GET',
    requiresAuth: true
  },
  {
    name: 'Création d\'excuse',
    endpoint: '/excuses/create',
    method: 'POST',
    requiresAuth: true,
    testData: {
      arbitre_nom: 'Test',
      arbitre_prenom: 'User',
      date_debut: '2024-01-01',
      date_fin: '2024-01-02',
      cause: 'Test API'
    }
  },
  
  // API FCM
  {
    name: 'Status FCM',
    endpoint: '/accounts/fcm/status',
    method: 'GET',
    requiresAuth: true
  },
  {
    name: 'Test FCM',
    endpoint: '/accounts/fcm/test',
    method: 'POST',
    requiresAuth: true
  },
  
  // API Push Notifications
  {
    name: 'Status Push',
    endpoint: '/accounts/push/status',
    method: 'GET',
    requiresAuth: true
  },
  {
    name: 'Test Push',
    endpoint: '/accounts/push/test',
    method: 'POST',
    requiresAuth: true
  },
  
  // API Notifications
  {
    name: 'Subscribe Push',
    endpoint: '/notifications/push/subscribe',
    method: 'POST',
    requiresAuth: true,
    testData: {
      endpoint: 'test-endpoint',
      keys: {
        p256dh: 'test-key',
        auth: 'test-auth'
      }
    }
  }
];

export async function GET(request: NextRequest) {
  const results: any[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  
  console.log('🔍 Début des tests de santé des API...');
  console.log('🌐 URL de base:', baseUrl);
  
  for (const test of API_TESTS) {
    try {
      console.log(`\n🧪 Test: ${test.name}`);
      console.log(`📍 Endpoint: ${test.endpoint}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Ajouter l'authentification si nécessaire
      if (test.requiresAuth) {
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
          headers['Authorization'] = authHeader;
        } else {
          results.push({
            name: test.name,
            endpoint: test.endpoint,
            status: 'SKIPPED',
            message: 'Authentification requise mais non fournie'
          });
          continue;
        }
      }
      
      const requestOptions: RequestInit = {
        method: test.method,
        headers
      };
      
      if (test.method === 'POST' && test.testData) {
        requestOptions.body = JSON.stringify(test.testData);
      }
      
      const response = await fetch(`${baseUrl}/api${test.endpoint}`, requestOptions);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { message: 'Réponse non-JSON' };
      }
      
      const result = {
        name: test.name,
        endpoint: test.endpoint,
        method: test.method,
        status: response.ok ? 'SUCCESS' : 'ERROR',
        statusCode: response.status,
        statusText: response.statusText,
        response: responseData,
        timestamp: new Date().toISOString()
      };
      
      results.push(result);
      
      console.log(`✅ ${test.name}: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      console.error(`❌ ${test.name}:`, error);
      
      results.push({
        name: test.name,
        endpoint: test.endpoint,
        method: test.method,
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Statistiques
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  const skippedCount = results.filter(r => r.status === 'SKIPPED').length;
  
  console.log(`\n📊 Résultats des tests:`);
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`⏭️ Ignorés: ${skippedCount}`);
  console.log(`📈 Total: ${results.length}`);
  
  return NextResponse.json({
    success: true,
    message: 'Tests de santé des API terminés',
    environment: process.env.NODE_ENV || 'development',
    baseUrl,
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      success: successCount,
      error: errorCount,
      skipped: skippedCount
    },
    results
  });
}
