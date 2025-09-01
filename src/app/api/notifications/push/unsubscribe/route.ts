import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    // Validation des données
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint manquant' },
        { status: 400 }
      );
    }

    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api'
      : 'http://localhost:8000/api';

    // Envoyer la requête de désabonnement au backend Django
    const response = await fetch(`${backendUrl}/accounts/push/unsubscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Erreur lors du désabonnement' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors du désabonnement aux notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
