import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, p256dh, auth } = body;

    // Validation des données
    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { error: 'Données d\'abonnement manquantes' },
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

    // Envoyer l'abonnement au backend Django
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    console.log('🔗 Tentative de connexion au backend:', backendUrl);
    
    // Créer un contrôleur d'abort pour gérer les timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes de timeout
    
    try {
      const response = await fetch(`${backendUrl}/accounts/push/subscribe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint,
          p256dh,
          auth
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('📡 Réponse du backend:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.detail || 'Erreur lors de l\'enregistrement de l\'abonnement' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('⏰ Timeout de la requête vers le backend');
          return NextResponse.json(
            { error: 'Timeout de la connexion au backend' },
            { status: 504 }
          );
        }
        
        if (fetchError.message.includes('fetch')) {
          console.error('🌐 Erreur de réseau:', fetchError.message);
          return NextResponse.json(
            { error: 'Impossible de se connecter au backend. Vérifiez que le serveur est démarré.' },
            { status: 503 }
          );
        }
      }
      
      throw fetchError; // Relancer l'erreur pour la gestion générale
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'abonnement aux notifications:', error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
