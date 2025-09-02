import { NextRequest, NextResponse } from 'next/server';

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

    const token = authHeader.split(' ')[1];

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api/accounts/fcm/status/'
      : 'http://localhost:8000/api/accounts/fcm/status/';

    console.log('🔍 Test FCM Status - Tentative de connexion au backend:', backendUrl);

    try {
      // Envoyer la requête au backend Django
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('📡 Réponse du backend:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.detail || 'Erreur lors de la vérification du statut FCM' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.error('❌ Erreur de connexion au backend:', fetchError);
      
      // Mode test : retourner un statut simulé si le backend n'est pas disponible
      return NextResponse.json({
        is_subscribed: false,
        device_type: 'web',
        last_updated: new Date().toISOString(),
        is_active: false,
        tokens: [],
        message: 'Backend non disponible - Mode test activé',
        backend_error: fetchError instanceof Error ? fetchError.message : 'Erreur inconnue'
      });
    }

  } catch (error) {
    console.error('Erreur lors de la vérification du statut FCM:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

