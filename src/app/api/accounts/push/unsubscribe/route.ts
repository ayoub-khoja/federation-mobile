import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Token d\'authentification manquant' }, { status: 401 });
    }

    // Récupérer l'endpoint actuel depuis le statut
    const statusResponse = await fetch('http://localhost:8000/api/accounts/push/status/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      return NextResponse.json(
        { error: 'Impossible de récupérer le statut des abonnements' },
        { status: statusResponse.status }
      );
    }

    const statusData = await statusResponse.json();
    const activeSubscriptions = statusData.subscriptions || [];
    
    if (activeSubscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun abonnement actif à désactiver'
      });
    }

    // Désactiver tous les abonnements actifs
    const results = [];
    for (const subscription of activeSubscriptions) {
      const response = await fetch('http://localhost:8000/api/accounts/push/unsubscribe/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        }),
      });

      if (response.ok) {
        results.push({ endpoint: subscription.endpoint, success: true });
      } else {
        results.push({ endpoint: subscription.endpoint, success: false });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Désabonnement traité',
      results: results
    });

  } catch (error) {
    console.error('Erreur lors du désabonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
