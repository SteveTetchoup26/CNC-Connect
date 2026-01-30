/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";
import { 
  type Concours, 
  type ConcoursFormData, 
  type SpecificationConcours,
  type SpecificationFormData 
} from "@/types/concours";

/* ===================== */
/* ==== CONCOURS ======= */
/* ===================== */

export const concoursService = {
  async getAll(params?: {
    search?: string;
    annee?: number;
    statut?: string;
    rubrique?: string;
    slider?: boolean;
    raw?: boolean;
    per_page?: number;
  }): Promise<any> {
    const { data } = await api.get("/concours", { params });
    return data;
  },

  async getById(id: number): Promise<any> {
    const { data } = await api.get(`/concours/${id}`);
    return data;
  },

  async create(payload: ConcoursFormData): Promise<Concours> {
    const { data } = await api.post("/admin/concours", payload);
    return data;
  },

  async update(id: number, payload: Partial<ConcoursFormData>): Promise<Concours> {
    const { data } = await api.put(`/admin/concours/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/concours/${id}`);
  },

  async getOpenConcours(): Promise<Concours[]> {
    const { data } = await api.get("/admin/concours/open");
    return data;
  },

  /* ===================== */
  /* ==== EXPORTS ======== */
  /* ===================== */

  /**
   * Export des concours en PDF
   */
  async exportPdf(params?: any): Promise<Blob> {
    const response = await api.get("/admin/concours/export/pdf", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Export des concours en Excel
   */
  async exportExcel(params?: any): Promise<Blob> {
    const response = await api.get("/admin/concours/export/excel", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Télécharger un fichier blob
   */
  async downloadBlob(blob: Blob, filename: string): Promise<void> {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /* ===================== */
  /* = EXPORT CANDIDATS == */
  /* ===================== */

  /**
   * Récupérer la liste des concours ayant des candidats
   */
  async getConcoursAvecCandidats(): Promise<any[]> {
    const { data } = await api.get("/admin/concours/avec-candidats");
    return data;
  },

  /**
   * Export des candidats d'un concours en PDF
   */
  async exportCandidatsPdf(concoursId: number): Promise<Blob> {
    const response = await api.get(`/admin/concours/${concoursId}/export-candidats-pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Export des candidats d'un concours en Excel
   */
  async exportCandidatsExcel(concoursId: number): Promise<Blob> {
    const response = await api.get(`/admin/concours/${concoursId}/export-candidats-excel`, {
      responseType: "blob",
    });
    return response.data;
  },
};

/* ===================== */
/* = SPECIFICATIONS ==== */
/* ===================== */

export const specificationService = {
  async getAll(): Promise<SpecificationConcours[]> {
    const { data } = await api.get("/admin/spec-concours");
    return data;
  },

  async getByConcours(concoursId: number): Promise<SpecificationConcours> {
    const { data } = await api.get(`/spec-concours/concours/${concoursId}`);
    return data;
  },

  async create(payload: SpecificationFormData): Promise<SpecificationConcours> {
    const { data } = await api.post("/admin/spec-concours", payload);
    return data;
  },

  async update(id: number, payload: Partial<SpecificationFormData>): Promise<SpecificationConcours> {
    const { data } = await api.put(`/admin/spec-concours/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/spec-concours/${id}`);
  },

  async getRequiredDocuments(concoursId: number): Promise<any> {
    const { data } = await api.get(`/spec-concours/concours/${concoursId}/documents`);
    return data;
  },
};