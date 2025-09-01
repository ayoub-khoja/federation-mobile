import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test de connectivité API...');
    
    // Test de connectivité vers le backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.101:8000/api';
    console.log('🔗 Test de connexion vers:', backendUrl);
    
    const response = await fetch(`${backendUrl}/accounts/test-auth/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
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
    
    return NextResponse.json({
      success: false,
      message: 'Erreur de connectivité',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      backend_url: process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.101:8000/api'
    }, { status: 500 });
  }
}
