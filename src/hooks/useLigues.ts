import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/config';

export interface Ligue {
  id: number;
  nom: string;
  description?: string;
  is_active: boolean;
  date_creation: string;
  ordre: number;
  region?: string;
  code?: string;
}

export const useLigues = () => {
  const [ligues, setLigues] = useState<Ligue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLigues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = getApiUrl('/accounts/ligues/');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Gérer la structure de réponse de l'API
      if (data.success && data.ligues) {
        setLigues(data.ligues);
      } else if (Array.isArray(data)) {
        // Fallback si la réponse est directement un tableau
        setLigues(data);
      } else {
        throw new Error('Format de réponse inattendu');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des ligues';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLigues();
  }, [fetchLigues]);

  return {
    ligues,
    loading,
    error,
    refetch: fetchLigues
  };
};


