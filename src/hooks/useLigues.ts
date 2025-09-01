import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/config';

export interface Ligue {
  id: number;
  nom: string;
  region: string;
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
      
      const url = getApiUrl('/ligues/');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setLigues(data);
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


