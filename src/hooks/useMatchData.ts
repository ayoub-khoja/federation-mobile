import { useState, useEffect } from 'react';
import { matchService } from '../services/matchService';
import { MatchType, MatchCategory } from '../types/match';

export const useMatchData = () => {
  const [matchTypes, setMatchTypes] = useState<MatchType[]>([]);
  const [matchCategories, setMatchCategories] = useState<MatchCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Récupérer les types de match et les catégories en parallèle
      const [typesResponse, categoriesResponse] = await Promise.all([
        matchService.getMatchTypes(),
        matchService.getMatchCategories()
      ]);

      // Filtrer seulement les éléments actifs et les trier par ordre
      const activeTypes = typesResponse.types
        .filter(type => type.is_active)
        .sort((a, b) => a.ordre - b.ordre);

      const activeCategories = categoriesResponse.categories
        .filter(category => category.is_active)
        .sort((a, b) => a.ordre - b.ordre);

      setMatchTypes(activeTypes);
      setMatchCategories(activeCategories);
    } catch (err) {
      console.error('Erreur lors du chargement des données de match:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, []);

  const refreshData = () => {
    fetchMatchData();
  };

  return {
    matchTypes,
    matchCategories,
    isLoading,
    error,
    refreshData
  };
};
