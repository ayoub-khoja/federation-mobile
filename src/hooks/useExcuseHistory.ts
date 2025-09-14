import { useState, useEffect } from 'react';

export interface Excuse {
  id: number;
  date_debut: string;
  date_fin: string;
  cause: string;
  piece_jointe: string | null;
  status: string;
  status_display: string;
  commentaire_admin: string | null;
  created_at: string;
  updated_at: string;
  traite_le: string | null;
  arbitre_nom: string;
  duree: number;
  is_en_cours: boolean;
  is_passee: boolean;
  is_future: boolean;
  can_be_modified: boolean;
  can_be_cancelled: boolean;
}

export interface ExcuseHistoryResponse {
  success: boolean;
  excuses: Excuse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export const useExcuseHistory = () => {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    has_next: false,
    has_previous: false
  });

  const fetchExcuses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Utiliser l'URL backend directe
      const backendUrl =
        process.env.NODE_ENV === "production"
          ? "https://federation-backend.onrender.com"
          : "http://localhost:8000";

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Vérifier si le token est expiré et le rafraîchir si nécessaire
      let finalToken = accessToken;
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const isExpired = payload.exp < Math.floor(Date.now() / 1000);

        if (isExpired) {
          console.warn("⚠️ Token expiré, tentative de rafraîchissement...");

          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const refreshResponse = await fetch(
              `${backendUrl}/api/accounts/token/refresh/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem("access_token", refreshData.access);
              finalToken = refreshData.access;
              console.log("✅ Token rafraîchi avec succès");
            } else {
              throw new Error("Impossible de rafraîchir le token");
            }
          } else {
            throw new Error("Aucun refresh token disponible");
          }
        }
      } catch (tokenError) {
        console.error("❌ Erreur de token:", tokenError);
        throw new Error("Token invalide ou expiré");
      }

      const response = await fetch(
        `${backendUrl}/api/accounts/arbitres/excuses/`,
        {
          headers: {
            Authorization: `Bearer ${finalToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération des excuses"
        );
      }

      if (data.success && data.excuses) {
        setExcuses(data.excuses);
        setPagination(
          data.pagination || {
            current_page: 1,
            total_pages: 1,
            total_count: data.excuses.length,
            has_next: false,
            has_previous: false,
          }
        );
      } else {
        setExcuses([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique des excuses:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setExcuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExcuses();
  }, []);

  const refreshExcuses = () => {
    fetchExcuses();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'acceptee':
        return 'bg-green-100 text-green-800';
      case 'refusee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente':
        return '⏳';
      case 'acceptee':
        return '✅';
      case 'refusee':
        return '❌';
      default:
        return '📋';
    }
  };

  const getPeriodStatus = (excuse: Excuse) => {
    if (excuse.is_en_cours) return { text: 'En cours', color: 'text-blue-600' };
    if (excuse.is_passee) return { text: 'Passée', color: 'text-gray-600' };
    if (excuse.is_future) return { text: 'Future', color: 'text-green-600' };
    return { text: 'Inconnue', color: 'text-gray-600' };
  };

  return {
    excuses,
    isLoading,
    error,
    pagination,
    refreshExcuses,
    formatDate,
    formatDateTime,
    getStatusColor,
    getStatusIcon,
    getPeriodStatus
  };
};
