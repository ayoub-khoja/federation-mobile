import { useState, useEffect } from 'react';
import { matchService } from '../services/matchService';
import { Match } from '../types/match';

export const useMatchHistory = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMatches, setTotalMatches] = useState(0);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await matchService.getMatchesByArbitre();
      
      setMatches(response.matches);
      setTotalMatches(response.matches.length);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique des matchs:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const refreshMatches = () => {
    fetchMatches();
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMatchTime = (timeString: string) => {
    return timeString.substring(0, 5); // Format HH:MM
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'arbitre_principal': 'Arbitre Principal',
      'arbitre_assistant': 'Arbitre Assistant',
      'arbitre_quatrieme': 'Arbitre Quatrième',
      'arbitre_var': 'Arbitre VAR',
      'observateur': 'Observateur',
      'delegue': 'Délégué',
      'commissaire': 'Commissaire'
    };
    return roleNames[role] || role;
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'in_progress': 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status: string) => {
    const statusNames: { [key: string]: string } = {
      'completed': 'Terminé',
      'pending': 'En attente',
      'cancelled': 'Annulé',
      'in_progress': 'En cours'
    };
    return statusNames[status] || status;
  };

  return {
    matches,
    isLoading,
    error,
    totalMatches,
    refreshMatches,
    formatMatchDate,
    formatMatchTime,
    getRoleDisplayName,
    getStatusColor,
    getStatusDisplayName
  };
};
