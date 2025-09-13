import { NextRequest, NextResponse } from 'next/server';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function PATCH(request: NextRequest) {
  try {
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Récupérer les données du formulaire
    const formData = await request.formData();
    
    // Vérifier que les champs sont autorisés
    const allowedFields = [
      'first_name',      // string
      'last_name',       // string
      'email',           // string (optionnel)
      'address',         // string (optionnel)
      'birth_date',      // date (YYYY-MM-DD)
      'birth_place',     // string (optionnel)
      'cin',             // string (optionnel, unique)
      'profile_photo',   // file (optionnel)
      'role',            // 'arbitre' | 'assistant'
      'grade',           // 'candidat' | '3eme_serie' | '2eme_serie' | '1ere_serie' | 'federale'
      'ligue'            // integer (ID de la ligue)
    ];

    // Filtrer les champs autorisés
    const filteredData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (allowedFields.includes(key)) {
        filteredData.append(key, value);
      }
    }

    // Envoyer la requête au backend Django
    const backendResponse = await fetch(`${BACKEND_URL}/api/accounts/arbitres/profile/update/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: filteredData,
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('❌ Erreur backend:', data);
      return NextResponse.json(
        { 
          error: 'Erreur lors de la mise à jour du profil',
          details: data 
        },
        { status: backendResponse.status }
      );
    }

    console.log('✅ Profil mis à jour avec succès:', data);
    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: data
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}








