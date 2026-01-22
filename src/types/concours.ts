/* ===================== */
/* ===== CONCOURS ====== */
/* ===================== */

export type Concours = {
  id: number;
  libelle_concours: string;
  date_limite: string;
  date_examen: string;
  created_at?: string;
  updated_at?: string;

  // Relations
  specification?: SpecificationConcours;
  frais_concours?: FraisConcours;
  sessions?: Session[];
  concours_filieres?: ConcoursFiliere[];
};

/* ===================== */
/* == FRAIS CONCOURS === */
/* ===================== */

export type FraisConcours = {
  id: number;
  montant_frais: number;
  nom_banque: string;
  numero_compte: string;
  concours_id: number;
};

/* ===================== */
/* = SPECIFICATION ===== */
/* ===================== */

export type SpecificationConcours = {
  id?: number;
  concours_id: number;
  desc_infos_concours?: string;
  carte_nationale_identite: boolean;
  diplomes: boolean;
  certificat_nationalite: boolean;
  releve_notes: boolean;
  acte_naissance: boolean;
  photo: boolean;
};

/* ===================== */
/* == CONCOURS FILIERE = */
/* ===================== */

export type ConcoursFiliere = {
  id: number;
  concours_id: number;
  filiere_id: number;
  nbre_places: number;
  filiere?: {
    id: number;
    libelle_filiere: string;
    departement?: {
      libelle_departement: string;
      ecole?: {
        libelle_ecole: string;
      };
    };
    niveaux?: Array<{
      id: number;
      libelle_niveau: string;
    }>;
  };
};

/* ===================== */
/* ====== SESSION ====== */
/* ===================== */

export type Session = {
  id: number;
  libelle_session: string;
  description_session?: string;
  annee?: number;
  statut?: string;
  historiques?: Array<{
    date_etat: string;
    etat: {
      libelle_etat: string;
    };
  }>;
};

/* ===================== */
/* == FORM DATA ======== */
/* ===================== */

export type ConcoursFormData = {
  libelle_concours: string;
  date_limite: string;
  date_examen: string;
  session_id: number;
  
  filieres: Array<{
    id: number;
    nbre_places: number;
  }>;
  
  frais_concours: {
    montant_frais: number;
    nom_banque: string;
    numero_compte: string;
  };
};

export type SpecificationFormData = {
  concours_id: number;
  desc_infos_concours?: string;
  carte_nationale_identite: boolean;
  diplomes: boolean;
  certificat_nationalite: boolean;
  releve_notes: boolean;
  acte_naissance: boolean;
  photo: boolean;
};