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
      ? 'https://federation-backend.onrender.com/api'
      : 'http://localhost:8000/api';
    console.log('📊 Vérification du statut des abonnements - Connexion au backend:', backendUrl);
    
    try {
      const response = await fetch(`${backendUrl}/accounts/push/status/`, {
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
          { error: errorData.detail || 'Erreur lors de la vérification du statut' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
      
    } catch (fetchError) {
      console.error('❌ Erreur de connexion au backend:', fetchError);
      return NextResponse.json(
        { error: 'Impossible de se connecter au backend. Vérifiez que le serveur Django est démarré.' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du statut:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
