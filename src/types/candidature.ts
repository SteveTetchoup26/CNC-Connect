/* ===================== */
/* === CANDIDATURE ===== */
/* ===================== */

export type Candidature = {
  id: number;
  candidat_id: number;
  concours_id: number;
  date_candidature: string;
  statut: string;
  code_candidat_temp?: string;
  code_candidat_def?: string;
  date_validation?: string;
  motif_rejet?: string;
  
  centre_depot_id?: number;
  centre_examen_id?: number;
  choix_filiere_1?: number;
  choix_filiere_2?: number;
  choix_filiere_3?: number;

  created_at?: string;
  updated_at?: string;

  // Relations
  candidat?: Candidat;
  concours?: {
    id: number;
    libelle_concours: string;
    date_limite: string;
    date_examen: string;
    concours_filieres?: Array<{
      filiere: {
        id: number;
        libelle_filiere: string;
        departement?: {
          libelle_departement: string;
          ecole?: {
            id: number;
            libelle_ecole: string;
          };
        };
      };
    }>;
  };
  centre_depot?: Centre;
  centre_examen?: Centre;
  historiques?: HistoriqueCandidature[];
  notifications?: Notification[];
};

/* ===================== */
/* ===== CANDIDAT ====== */
/* ===================== */

export type Candidat = {
  id: number;
  utilisateur_id: number;
  
  // Informations personnelles
  adresse?: string;
  nationalite?: string;
  sexe?: "M" | "F";
  date_naissance?: string;
  lieu_naissance?: string;
  region_origine?: string;
  ville_origine?: string;
  departement_origine?: string;
  statut_matrimonial?: string;
  handicap?: string;

  // Pièce d'identité
  numero_cni?: string;
  date_delivrance_cni?: string;

  // Informations familiales
  nom_mere?: string;
  telephone_mere?: string;
  nom_pere?: string;
  telephone_pere?: string;
  nom_tuteur?: string;
  telephone_tuteur?: string;

  // Informations scolaires
  niveau_scolaire?: string;
  filiere_origine?: string;
  diplome_admission?: string;
  mention?: string;
  annee_diplome?: string;

  // Relation
  utilisateur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
};

/* ===================== */
/* ====== CENTRE ======= */
/* ===================== */

export type Centre = {
  id: number;
  libelle_centre: string;
  type_centre: "CENTRE_DE_DEPÔT" | "CENTRE_EXAMEN";
  ville_centre: string;
  capacite: number;
  region_id: number;
  region?: {
    label_region: string;
  };
};

/* ===================== */
/* ==== HISTORIQUE ===== */
/* ===================== */

export type HistoriqueCandidature = {
  id: number;
  candidature_id: number;
  etat_id: number;
  date_etat: string;
  commentaire?: string;
  etat: {
    id: number;
    libelle_etat: string;
    description_etat?: string;
  };
};

/* ===================== */
/* === NOTIFICATION ==== */
/* ===================== */

export type Notification = {
  id: number;
  intitule: string;
  contenu: string;
  candidature_id?: number;
  user_id?: number;
  created_at: string;
};

/* ===================== */
/* === FORM DATA ======= */
/* ===================== */

export type ValiderCandidatureData = {
  candidature_id: number;
};

export type RejeterCandidatureData = {
  motif_rejet: string;
};

export type AffecterCentresData = {
  centre_depot_id?: number;
  centre_examen_id?: number;
};