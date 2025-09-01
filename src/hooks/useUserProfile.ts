import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/user';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Aucun token d\'authentification trouvé');
        return null;
      }

      const response = await fetch('/api/accounts/arbitres/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profile: UserProfile = await response.json();
        setUserProfile(profile);
        
        // Sauvegarder dans localStorage pour un accès rapide
        localStorage.setItem('user_data', JSON.stringify(profile));
        
        return profile;
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || `Erreur ${response.status}: ${response.statusText}`;
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (updateData: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Aucun token d\'authentification trouvé');
        return false;
      }

      const response = await fetch('/api/accounts/arbitres/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        
        // Mettre à jour le localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedProfile));
        
        return true;
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || `Erreur ${response.status}: ${response.statusText}`;
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUserProfile = useCallback(() => {
    setUserProfile(null);
    setError(null);
    localStorage.removeItem('user_data');
  }, []);

  // Charger le profil depuis le localStorage au montage
  useEffect(() => {
    const cachedProfile = localStorage.getItem('user_data');
    if (cachedProfile) {
      try {
        const profile = JSON.parse(cachedProfile);
        setUserProfile(profile);
      } catch {
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    loadUserProfile,
    updateUserProfile,
    clearUserProfile,
    setUserProfile
  };
};






