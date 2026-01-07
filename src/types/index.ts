/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  success: boolean;
  loading: boolean;
  error: string | null;
}

export interface ConcoursState {
  data: any[];
  selected: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    password: string;
    password_confirmation: string;
}
