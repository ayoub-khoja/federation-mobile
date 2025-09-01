export interface MatchType {
  id: number;
  nom: string;
  code: string;
  description: string;
  is_active: boolean;
  ordre: number;
}

export interface MatchCategory {
  id: number;
  nom: string;
  code: string;
  age_min: number;
  age_max: number;
  description: string;
  is_active: boolean;
  ordre: number;
}

export interface MatchTypesResponse {
  success: boolean;
  types: MatchType[];
}

export interface MatchCategoriesResponse {
  success: boolean;
  categories: MatchCategory[];
}

export interface Match {
  id: number;
  type_match: number;
  categorie: number;
  type_match_info?: {
    id: number;
    nom: string;
    code: string;
    description: string;
    is_active: boolean;
    ordre: number;
  };
  categorie_info?: {
    id: number;
    nom: string;
    code: string;
    age_min: number;
    age_max: number;
    description: string;
    is_active: boolean;
    ordre: number;
  };
  stadium: string;
  match_date: string;
  match_time: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  role: string;
  description?: string;
  match_sheet?: string;
  referee: number;
  referee_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  match_report?: string;
  incidents?: string;
  events: any[];
  score_display: string;
  has_score: boolean;
  is_completed: boolean;
}

export interface MatchHistoryResponse {
  success: boolean;
  message: string;
  matches: Match[];
}
