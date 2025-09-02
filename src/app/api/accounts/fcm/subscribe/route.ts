import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fcm_token, user_agent } = body;

    if (!fcm_token) {
      return NextResponse.json(
        { error: 'Token FCM requis' },
        { status: 400 }
      );
    }

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api/accounts/fcm/subscribe/'
      : 'http://localhost:8000/api/accounts/fcm/subscribe/';

    console.log('🔔 FCM Subscribe - Tentative de connexion au backend:', backendUrl);

    // Envoyer le token FCM au backend Django
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        fcm_token,
        device_type: 'web',
        user_agent: user_agent || 'Unknown'
      }),
    });

    console.log('📡 Réponse du backend:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors de l\'inscription FCM' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors de l\'inscription FCM:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

