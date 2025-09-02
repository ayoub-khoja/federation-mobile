export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number: string;
  grade: string;
  role?: string; // 'arbitre' ou 'assistant'
  birth_date?: string;
  birth_place?: string;
  ligue?: number;
  ligue_nom?: string;
  ligue_region?: string;
  license_number?: string;
  niveau_competition?: string;
  is_verified?: boolean;
  profile_photo?: string;
  address?: string;
  full_name?: string;
  cin?: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  [key: string]: unknown;
}
