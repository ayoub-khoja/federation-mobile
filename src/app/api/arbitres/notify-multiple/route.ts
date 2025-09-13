import { NextRequest, NextResponse } from 'next/server';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notifications } = body;

    if (!notifications || !Array.isArray(notifications)) {
      return NextResponse.json(
        { error: 'Données invalides: notifications doit être un tableau' },
        { status: 400 }
      );
    }

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api/arbitres/notify-multiple/'
      : 'http://localhost:8000/api/arbitres/notify-multiple/';

    console.log('🔔 Notifications multiples arbitres - Tentative de connexion au backend:', backendUrl);

    // Envoyer les notifications au backend Django
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({ notifications })
    });

    console.log('📡 Réponse du backend:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors de l\'envoi des notifications' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors des notifications arbitres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}









