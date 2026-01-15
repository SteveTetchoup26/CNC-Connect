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


export interface InscriptionData {
  concours_id: string | undefined;
  nom: string;
  prenom: string;
  adresse: string;
  nationalite: string;
  sexe: string;
  date_naissance: string;
  lieu_naissance: string;
  region_origine: string;
  departement_origine: string;
  ville_origine: string;
  statut_matrimonial: string;
  handicap?: string;
  photo?: FileList;
  numero_cni: string;
  date_delivrance_cni: string;
  nom_mere: string;
  telephone_mere: string;
  nom_pere: string;
  telephone_pere: string;
  nom_tuteur?: string;
  telephone_tuteur?: string;
  niveau_scolaire: string;
  filiere_origine: string;
  diplome_admission: string;
  mention: string;
  annee_diplome: number;
  num_recu: string;
  fiche_paiement?: FileList;
  centre_depot_id: string;
  centre_examen_id: string;
}

export interface InscriptionResponse {
  message: string;
  candidat: any;
  candidature: any;
  code_temporaire: string;
  statut: string;
  download_url: string;
}
