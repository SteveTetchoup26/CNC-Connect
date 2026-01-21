/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  success: boolean;
  loading: boolean;
  error: string | null;
  roles: string[];
}

export interface ConcoursState {
  data: any[];
  selected: any | null;
  loading: boolean;
  error: string | null;
  meta: ConcoursMeta | null;
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

export interface Concours {
  id: number;
  libelle_concours: string;
  description?: string;
  date_examen?: Date;
  sessions?: any[];
  frais_concours?: {
    montant_frais: number;
  };
}

export interface ConcoursMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface FetchConcoursParams {
  page?: number;
  per_page?: number;
  search?: string;
  annee?: number;
  statut?: string;
  raw?: boolean;
  rubrique?: string;
}


export interface Candidature {
  id: number;
  candidat_id: number;
  concours_id: number;
  centre_depot_id: number;
  centre_examen_id: number;
  // statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE' | 'ADMIS' | 'NON_ADMIS';
  status: string;
  date_candidature: string;
  code_candidat: string;
  fiche_url?: string;
  candidat: {
    id: number;
    utilisateur: {
      id: number;
      name: string;
      email: string;
    };
  };
  concours: {
    id: number;
    libelle_concours: string;
    date_examen: string;
    date_limite: string;
    concours_filieres: Array<{
      id: number;
      filiere: {
        id: number;
        libelle_filiere: string;
        departement: {
          id: number;
          libelle_departement: string;
          ecole: {
            id: number;
            libelle_ecole: string;
            logo_url?: string;
            banniere_url?: string;
          };
        };
      };
    }>;
  };
  centre_depot: {
    id: number;
    libelle_centre: string;
    ville_centre: string;
  };
  centre_examen: {
    id: number;
    libelle_centre: string;
    ville_centre: string;
  };
  historiques: Array<{
    id: number;
    etat: {
      id: number;
      libelle_etat: string;
    };
  }>;
  rappel?: {
    id: number;
    date_rappel: string;
    heure_rappel: string;
    email_envoye: boolean;
  };
}

export interface RappelData {
  date_rappel: string;
  heure_rappel: string;
}


