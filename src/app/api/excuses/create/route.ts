import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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

    const token = authHeader.substring(7);

    // Récupérer les données du formulaire (FormData)
    const formData = await request.formData();
    
    // Extraire les champs
    const arbitre_nom = formData.get('arbitre_nom') as string;
    const arbitre_prenom = formData.get('arbitre_prenom') as string;
    const date_debut = formData.get('date_debut') as string;
    const date_fin = formData.get('date_fin') as string;
    const cause = formData.get('cause') as string;
    const piece_jointe = formData.get('piece_jointe') as File | null;
    
    // Validation des champs obligatoires
    if (!date_debut || !date_fin || !cause) {
      return NextResponse.json(
        { error: 'Les champs date de début, date de fin et cause sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que la date de fin est après la date de début
    if (new Date(date_fin) <= new Date(date_debut)) {
      return NextResponse.json(
        { error: 'La date de fin doit être postérieure à la date de début' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier si présent
    if (piece_jointe && piece_jointe.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La taille du fichier ne doit pas dépasser 5MB' },
        { status: 400 }
      );
    }

    // Préparer FormData pour l'API backend
    const backendFormData = new FormData();
    backendFormData.append('arbitre_nom', arbitre_nom);
    backendFormData.append('arbitre_prenom', arbitre_prenom);
    backendFormData.append('date_debut', date_debut);
    backendFormData.append('date_fin', date_fin);
    backendFormData.append('cause', cause.trim());
    
    if (piece_jointe) {
      backendFormData.append('piece_jointe', piece_jointe);
    }

    // Envoyer la requête au backend Django
    const backendResponse = await fetch(`${BACKEND_URL}/api/accounts/arbitres/excuses/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type pour FormData
      },
      body: backendFormData,
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('❌ Erreur backend:', data);
      return NextResponse.json(
        { 
          error: 'Erreur lors de la création de l\'excuse',
          details: data 
        },
        { status: backendResponse.status }
      );
    }

    console.log('✅ Excuse créée avec succès:', data);
    return NextResponse.json({
      success: true,
      message: 'Excuse créée avec succès',
      data: data
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'excuse:', error);
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
