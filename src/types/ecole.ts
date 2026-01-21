/* ===================== */
/* ====== ÉCOLE ======= */
/* ===================== */

export type Ecole = {
  id?: number;

  libelle_ecole: string;
  code_ecole: string;
  localisation: string;
  email_ecole: string;

  telephone_ecole?: string;
  bp_ecole?: string;
  siteweb_ecole?: string;
  devise?: string;

  logo_url?: string;
  banniere_url?: string;
  embleme_ecole?: string;

  departements?: Departement[];
};

/* ===================== */
/* === DÉPARTEMENT ===== */
/* ===================== */

export type Departement = {
  id?: number;

  libelle_departement: string;
  code_departement: string;
  description_departement: string;

  filieres: Filiere[];
};

/* ===================== */
/* ===== FILIÈRE ======= */
/* ===================== */

export type Filiere = {
  id?: number;

  libelle_filiere: string;
  code_filiere?: string;
  description_filiere?: string;

  niveaux: Niveau[];
};

/* ===================== */
/* === NIVEAU + MAT ===== */
/* ===================== */

export interface Matiere {
  id?: number;
  libelle_matiere: string;
  code_matiere?: string;
}

export interface Niveau {
  id?: number;
  libelle_niveau: string;
  matieres: Matiere[];
}

/* ===================== */
/* === DATA FORM MODAL == */
/* ===================== */

export type EcoleFormData = {
  ecole: {
    libelle_ecole: string;
    code_ecole: string;
    localisation: string;
    email_ecole: string;

    telephone_ecole?: string;
    bp_ecole?: string;
    siteweb_ecole?: string;
    devise?: string;

    logo?: File | null;
    banniere?: File | null;
    embleme_ecole?: File | null;
  };

  departements: Departement[];
};

export type SelectOption = {
  label: string;
  value: number;
};