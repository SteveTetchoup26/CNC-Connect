/* ===================== */
/* === UTILISATEUR ===== */
/* ===================== */

export type Utilisateur = {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;

  // Relations
  roles?: Role[];
};

/* ===================== */
/* ====== ROLE ========= */
/* ===================== */

export type Role = {
  id: number;
  libelle: string;
  description?: string;
};

/* ===================== */
/* === FORM DATA ======= */
/* ===================== */

export type UtilisateurFormData = {
  email: string;
  password?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  role_id: number;
};