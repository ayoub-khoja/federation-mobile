import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const arbitreId = params.id;

    if (!arbitreId) {
      return NextResponse.json(
        { error: 'ID arbitre manquant' },
        { status: 400 }
      );
    }

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? `https://federation-backend.onrender.com/api/arbitres/${arbitreId}/notifications/`
      : `http://localhost:8000/api/arbitres/${arbitreId}/notifications/`;

    console.log('📋 Historique notifications arbitre - Tentative de connexion au backend:', backendUrl);

    // Récupérer l'historique des notifications
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      }
    });

    console.log('📡 Réponse du backend:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors de la récupération de l\'historique' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

