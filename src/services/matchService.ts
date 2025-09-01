import { MatchTypesResponse, MatchCategoriesResponse, MatchHistoryResponse } from '../types/match';
import { getApiUrl } from '../config/config';
import { TokenManager } from '../utils/api';

export interface CreateMatchData {
  type_match: number;
  categorie: number;
  stadium: string;
  match_date: string;
  match_time: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  role?: string;
  description?: string;
  match_sheet?: File;
}

export interface CreateMatchResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, any>;
}

export const matchService = {
  /**
   * Récupère tous les types de match actifs
   */
  async getMatchTypes(): Promise<MatchTypesResponse> {
    try {
      const url = getApiUrl('/matches/types/');
      const token = TokenManager.getAccessToken();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Erreur lors de la récupération des types de match');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur dans matchService.getMatchTypes:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les catégories de match actives
   */
  async getMatchCategories(): Promise<MatchCategoriesResponse> {
    try {
      const url = getApiUrl('/matches/categories/');
      const token = TokenManager.getAccessToken();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Erreur lors de la récupération des catégories de match');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur dans matchService.getMatchCategories:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau match
   */
  async createMatch(matchData: CreateMatchData): Promise<CreateMatchResponse> {
    try {
      const url = getApiUrl('/matches/');
      const token = TokenManager.getAccessToken();
      
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Préparer les données pour l'envoi
      const formData = new FormData();
      
      // Ajouter tous les champs obligatoires
      formData.append('type_match', matchData.type_match.toString());
      formData.append('categorie', matchData.categorie.toString());
      formData.append('stadium', matchData.stadium);
      formData.append('match_date', matchData.match_date);
      formData.append('match_time', matchData.match_time);
      formData.append('home_team', matchData.home_team);
      formData.append('away_team', matchData.away_team);
      
      // Ajouter les champs optionnels s'ils existent
      if (matchData.home_score !== undefined) {
        formData.append('home_score', matchData.home_score.toString());
      }
      if (matchData.away_score !== undefined) {
        formData.append('away_score', matchData.away_score.toString());
      }
      if (matchData.role) {
        formData.append('role', matchData.role);
      }
      if (matchData.description) {
        formData.append('description', matchData.description);
      }
      if (matchData.match_sheet) {
        formData.append('match_sheet', matchData.match_sheet);
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      
      return {
        success: true,
        message: 'Match créé avec succès',
        data: data
      };
    } catch (error) {
      console.error('Erreur dans matchService.createMatch:', error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des matchs de l'arbitre connecté
   */
  async getMatchesByArbitre(): Promise<MatchHistoryResponse> {
    try {
      const url = getApiUrl('/matches/');
      const token = TokenManager.getAccessToken();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Erreur lors de la récupération des matchs');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur dans matchService.getMatchesByArbitre:', error);
      throw error;
    }
  }
};
