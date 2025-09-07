import { NextRequest, NextResponse } from 'next/server';

// Forcer la route à être dynamique pour éviter les timeouts de build
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test de connectivité API...');
    
    // Test de connectivité vers le backend
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://federation-backend.onrender.com/api'
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
    console.log('🔗 Test de connexion vers:', backendUrl);
    
    // Ajouter un timeout pour éviter les blocages
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
    
    const response = await fetch(`${backendUrl}/accounts/test-auth/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Réponse du backend:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: 'Connexion au backend réussie',
        backend_status: response.status,
        backend_data: data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erreur de connexion au backend',
        backend_status: response.status,
        backend_statusText: response.statusText
      }, { status: 502 });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de connectivité:', error);
    
    // Gérer spécifiquement les erreurs de timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        message: 'Timeout de connexion au backend',
        error: 'Le backend ne répond pas dans les temps (5s)',
        backend_url: process.env.NODE_ENV === 'production' 
          ? 'https://federation-backend.onrender.com/api'
          : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
      }, { status: 504 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erreur de connectivité',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      backend_url: process.env.NODE_ENV === 'production' 
        ? 'https://federation-backend.onrender.com/api'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
    }, { status: 500 });
  }
}
