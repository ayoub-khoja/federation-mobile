import { NextRequest, NextResponse } from 'next/server';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      arbitre_id,
      arbitre_nom,
      arbitre_email,
      match_id,
      match_nom,
      match_date,
      match_lieu,
      designation_type,
      message
    } = body;

    // Validation des données requises
    if (!arbitre_id || !match_id || !designation_type) {
      return NextResponse.json(
        { error: 'Données manquantes: arbitre_id, match_id et designation_type sont requis' },
        { status: 400 }
      );
    }

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api/arbitres/notify-designation/'
      : 'http://localhost:8000/api/arbitres/notify-designation/';

    console.log('🔔 Notification arbitre - Tentative de connexion au backend:', backendUrl);

    // Envoyer la notification au backend Django
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        arbitre_id,
        arbitre_nom,
        arbitre_email,
        match_id,
        match_nom,
        match_date,
        match_lieu,
        designation_type,
        message: message || `Vous avez été désigné comme ${designation_type} pour le match ${match_nom}`
      })
    });

    console.log('📡 Réponse du backend:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors de l\'envoi de la notification' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors de la notification arbitre:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
