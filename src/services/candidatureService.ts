/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/candidatureService.ts
import api from "@/api/axios";
import axios from "axios";

export const fetchCandidatures = async () => {
  const response = await api.get("/candidatures");
  return response.data;
};

export const fetchCandidatureById = async (id: number | string) => {
  const response = await api.get(`/candidatures/${id}`);
  return response.data;
};

export const createRappel = async (
  candidatureId: number,
  data: { date_rappel: string; heure_rappel: string }
) => {
  const response = await api.post(`/candidatures/${candidatureId}/rappel`, data);
  return response.data;
};

export const downloadFiche = async (candidatureId: number) => {
  const response = await axios.get(`http://localhost:8000/api/candidature/${candidatureId}/fiche/download`, {
    responseType: 'blob', 
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `fiche-candidature-${candidatureId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  return { success: true };
};

export const submitInscription = async (data: FormData) => {
  const response = await api.post("/inscription-concours", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

import { 
  type Candidature,
  type RejeterCandidatureData,
  type AffecterCentresData
} from "@/types/candidature";

/* ===================== */
/* == CANDIDATURES ===== */
/* ===================== */

export const candidatureService = {
  async getAll(params?: {
    statut?: string;
    ecole_id?: number;
    sort_by?: string;
    order?: string;
    per_page?: number;
    page?: number;
  }): Promise<any> {
    const { data } = await api.get("/admin/candidatures", { params });
    return data;
  },

  async getById(id: number): Promise<Candidature> {
    const { data } = await api.get(`/admin/candidatures/${id}`);
    return data;
  },

  async update(id: number, payload: any): Promise<Candidature> {
    const { data } = await api.put(`/admin/candidatures/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/candidatures/${id}`);
  },

  async valider(id: number): Promise<any> {
    const { data } = await api.post(`/admin/candidatures/${id}/valider`);
    return data;
  },

  async rejeter(id: number, payload: RejeterCandidatureData): Promise<any> {
    const { data } = await api.post(`/admin/candidatures/${id}/rejeter`, payload);
    return data;
  },

  async affecterCentres(id: number, payload: AffecterCentresData): Promise<Candidature> {
    const { data } = await api.post(`/admin/candidatures/${id}/affecter-centres`, payload);
    return data;
  },
};