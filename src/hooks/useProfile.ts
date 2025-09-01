import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/config';

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  grade: string;
  birth_date?: string;
  birth_place?: string;
  ligue?: string;
  ligue_nom?: string;
  ligue_region?: string;
  license_number?: string;
  niveau_competition?: string;
  is_verified?: boolean;
  profile_photo?: string;
  address?: string;
  full_name?: string;
  date_joined: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le token d'authentification
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      return token;
    }
    return null;
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    const hasToken = !!getAuthToken();
    return hasToken;
  };

  // Charger le profil utilisateur
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated()) {
      setError('Utilisateur non connecté');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const url = getApiUrl('/accounts/arbitres/profile/');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        if (response.status === 403) {
          throw new Error('Accès interdit. Vérifiez vos permissions.');
        }
        
        if (response.status === 404) {
          throw new Error('Service non disponible. Contactez l\'administrateur.');
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      let userData: UserProfile;
      
      if (data.success && data.user) {
        userData = data.user;
      } else if (data.id && data.first_name && data.last_name) {
        userData = data as UserProfile;
      } else {
        throw new Error(data.message || 'Format de données non reconnu');
      }

      setProfile(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour le profil
  const updateProfile = useCallback(async (updateData: Partial<UserProfile>) => {
    if (!isAuthenticated()) {
      setError('Utilisateur non connecté');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const url = getApiUrl('/accounts/arbitres/profile/update/');

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour le profil local
        if (profile) {
          const updatedProfile = { ...profile, ...updateData };
          setProfile(updatedProfile);
          localStorage.setItem('user_data', JSON.stringify(updatedProfile));
        }
        return true;
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setProfile(null);
    setError(null);
    window.location.href = '/';
  }, []);

  // Calculer l'âge
  const getAge = useCallback(() => {
    if (!profile?.birth_date) return null;
    
    const birthDate = new Date(profile.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, [profile]);

  // Formater la date d'inscription
  const getFormattedJoinDate = useCallback(() => {
    if (!profile?.date_joined) return 'Date inconnue';
    
    return new Date(profile.date_joined).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [profile]);

  // Charger le profil au montage du composant
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    logout,
    getAge,
    getFormattedJoinDate,
  };
};
