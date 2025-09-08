import { NextRequest, NextResponse } from 'next/server';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fcm_token } = body;

    if (!fcm_token) {
      return NextResponse.json(
        { error: 'Token FCM requis' },
        { status: 400 }
      );
    }

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api/accounts/fcm/unsubscribe/'
      : 'http://localhost:8000/api/accounts/fcm/unsubscribe/';

    console.log('🔕 FCM Unsubscribe - Tentative de connexion au backend:', backendUrl);

    // Envoyer la demande de désabonnement au backend Django
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        fcm_token
      }),
    });

    console.log('📡 Réponse du backend:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors du désabonnement FCM' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors du désabonnement FCM:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}







