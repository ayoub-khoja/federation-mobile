import { useState, useEffect, useCallback } from 'react';

export interface Ligue {
  id: number;
  code: string;
  nom: string;
  region: string;
  active: boolean;
  ordre: number;
}

export interface LiguesResponse {
  success: boolean;
  ligues: Ligue[];
  count: number;
  message?: string;
}

export const useLigues = () => {
  const [ligues, setLigues] = useState<Ligue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuration de l'URL de base
  const getBaseURL = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'http://192.168.1.101:8000/api';
      }
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  };

  // Charger la liste des ligues
  const fetchLigues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getBaseURL()}/accounts/ligues/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: LiguesResponse = await response.json();

      if (data.success) {
        setLigues(data.ligues);
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des ligues');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du chargement des ligues:', err);
      
      // Fallback avec des ligues par défaut en cas d'erreur
      setLigues([
        { id: 1, code: 'tunis', nom: 'Ligue de Tunis', region: 'Grand Tunis', active: true, ordre: 1 },
        { id: 2, code: 'sfax', nom: 'Ligue de Sfax', region: 'Centre', active: true, ordre: 2 },
        { id: 3, code: 'sousse', nom: 'Ligue de Sousse', region: 'Sahel', active: true, ordre: 3 },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer une nouvelle ligue
  const createLigue = useCallback(async (ligueData: {
    code: string;
    nom: string;
    region: string;
    active?: boolean;
    ordre?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getBaseURL()}/accounts/ligues/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Ajouter l'authentification si nécessaire
        },
        body: JSON.stringify(ligueData),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Recharger la liste des ligues
        await fetchLigues();
        return data.ligue;
      } else {
        throw new Error(data.message || 'Erreur lors de la création de la ligue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la création de la ligue:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchLigues]);

  // Charger les ligues au montage du composant
  useEffect(() => {
    fetchLigues();
  }, [fetchLigues]);

  // Formater les ligues pour les select options
  const liguesOptions = ligues.map(ligue => ({
    value: ligue.code,
    label: `${ligue.nom} (${ligue.region})`
  }));

  return {
    ligues,
    liguesOptions,
    isLoading,
    error,
    fetchLigues,
    createLigue,
    hasLigues: ligues.length > 0
  };
};


