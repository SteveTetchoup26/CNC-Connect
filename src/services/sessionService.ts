import api from "@/api/axios";


export type EtatSession = {
  id: number;
  libelle_etat: "OUVERTE" | "FERMEE";
  description_etat?: string;
};

export type HistoriqueSession = {
  id: number;
  date_etat: string;
  etat: EtatSession;
};

export type Session = {
  id: number;
  libelle_session: string;
  description_session: string;
  historiques: HistoriqueSession[];
};

export const sessionService = {
  async getAll(): Promise<Session[]> {
    const { data } = await api.get("/admin/sessions");
    return data;
  },

  async create(payload: {
    libelle_session: string;
    description_session: string;
  }) {
    const { data } = await api.post("/admin/sessions", payload);
    return data;
  },

  async update(
    id: number,
    payload: Partial<{
      libelle_session: string;
      description_session: string;
      etat_id?: number;
    }>
  ) {
    const { data } = await api.put(`/admin/sessions/${id}`, payload);
    return data;
  },

  async delete(id: number) {
    const { data } = await api.delete(`/admin/sessions/${id}`);
    return data;
  },

  async changeEtat(session_id: number, etat_id: number) {
    const { data } = await api.post(
      `/admin/sessions/${session_id}/etat`,
      { etat_id: etat_id }
    );
    return data;
  },

  async getEtatSession(): Promise<EtatSession[]> {
    const { data } = await api.get("/admin/sessions/etats");
    return data;
  },
};
