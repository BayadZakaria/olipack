
export type UserRole = 'ADMIN' | 'TECHNICIEN' | 'COLLECTEUR' | 'HUILERIE';

export interface UserProfile {
  id?: string;
  nom: string;
  prenom: string;
  cin: string;
  telephone: string;
  email: string;
  password?: string;
  fonction: string;
  role: UserRole;
  isVVIP?: boolean;
}

export const AppSection = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  STRATEGY: 'strategy',
  STUDIO: 'studio',
  ASSISTANT: 'assistant',
  ADMIN_CONTROL: 'admin_control',
  ML_PREDICT: 'ml_predict',
  QUALITY_CONTROL: 'quality_control',
  IMPACT: 'impact',
  ATELIER: 'atelier',
  PROFILE: 'profile'
} as const;

export type AppSection = typeof AppSection[keyof typeof AppSection];
