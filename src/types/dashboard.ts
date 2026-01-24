/* ===================== */
/* ===== DASHBOARD ===== */
/* ===================== */

export type DashboardStats = {
  // Candidatures
  total_candidatures: number;
  candidatures_en_attente: number;
  candidatures_approuvees: number;
  candidatures_rejetees: number;
  candidatures_validees: number;
  candidatures_ce_mois: number;
  candidatures_aujourdhui: number;

  // Utilisateurs
  total_utilisateurs: number;
  total_candidats: number;

  // Concours
  total_concours: number;
  concours_actifs: number;
  concours_termines: number;

  // Écoles et Centres
  total_ecoles: number;
  total_centres: number;
  centres_depot: number;
  centres_examen: number;

  // Sessions
  total_sessions: number;
};

export type CandidatureParStatut = {
  statut: string;
  total: number;
  label: string;
};

export type CandidatureParMois = {
  mois: string;
  mois_complet: string;
  total: number;
  annee: number;
  mois_numero: number;
};

export type CandidatureParEcole = {
  libelle_ecole: string;
  total: number;
};

export type CandidatureParConcours = {
  libelle_concours: string;
  total: number;
};

export type ConcoursActif = {
  id: number;
  libelle_concours: string;
  date_limite: string;
  date_examen: string;
  ecole?: string;
  montant_frais?: number;
  jours_restants: number;
};

export type CandidatureRecente = {
  id: number;
  candidat_nom?: string;
  candidat_prenom?: string;
  candidat_email?: string;
  concours?: string;
  ecole?: string;
  date_candidature: string;
  statut: string;
  code_candidat_prov?: string;
};

export type TauxReussite = {
  total: number;
  approuvees: number;
  rejetees: number;
  en_attente: number;
  taux_approbation: number;
  taux_rejet: number;
};

export type DashboardData = {
  stats: DashboardStats;
  candidatures_par_statut: CandidatureParStatut[];
  candidatures_par_mois: CandidatureParMois[];
  candidatures_par_ecole: CandidatureParEcole[];
  candidatures_par_concours: CandidatureParConcours[];
  concours_actifs: ConcoursActif[];
  candidatures_recentes: CandidatureRecente[];
  taux_reussite: TauxReussite;
};