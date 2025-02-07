export interface Question {
  id?: string;
  category: 'Food' | 'Water' | 'Minerals' | 'Forest';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export interface AdminState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}