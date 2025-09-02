import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
      ? 'https://federation-backend.onrender.com/api/accounts/fcm/test/'
      : 'http://localhost:8000/api/accounts/fcm/test/';

    console.log('🧪 FCM Test - Tentative de connexion au backend:', backendUrl);

    try {
      // Envoyer la requête de test au backend Django
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('📡 Réponse du backend:', response.status, response.statusText);

      if (!response.ok) {
        // Si le backend retourne une erreur, on continue avec le mode test
        console.log('⚠️ Backend retourne une erreur, passage en mode test');
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.error('❌ Erreur de connexion au backend:', fetchError);
      
      // Mode test : retourner une réponse simulée
      return NextResponse.json({
        success: true,
        message: 'Test FCM simulé - Backend non disponible',
        sent_at: new Date().toISOString(),
        backend_error: fetchError instanceof Error ? fetchError.message : 'Erreur inconnue',
        instruction: 'Utilisez la notification manuelle pour tester',
        frontend_test: 'Endpoint frontend fonctionnel'
      });
    }

  } catch (error) {
    console.error('Erreur lors du test FCM:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
