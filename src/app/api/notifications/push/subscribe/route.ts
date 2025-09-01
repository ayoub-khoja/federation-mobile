import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userAgent } = body;

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription requise' },
        { status: 400 }
      );
    }

    // Configuration automatique selon l'environnement
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://federation-backend.onrender.com/api/notifications/push/subscribe/'
      : 'http://localhost:8000/api/notifications/push/subscribe/';

    // Envoyer la subscription au backend Django
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        user_agent: userAgent || 'Unknown'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors de l\'inscription' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors de l\'inscription aux notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
