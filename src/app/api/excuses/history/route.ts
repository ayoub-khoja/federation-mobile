import { NextRequest, NextResponse } from 'next/server';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Envoyer la requête au backend Django
    const backendResponse = await fetch(`${BACKEND_URL}/api/accounts/arbitres/excuses/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('❌ Erreur backend:', data);
      return NextResponse.json(
        { 
          error: 'Erreur lors de la récupération de l\'historique des excuses',
          details: data 
        },
        { status: backendResponse.status }
      );
    }

    console.log('✅ Historique des excuses récupéré avec succès');
    return NextResponse.json({
      success: true,
      message: 'Historique des excuses récupéré avec succès',
      excuses: data.excuses || data || []
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique des excuses:', error);
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
