/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";
import type { FetchConcoursParams } from "@/types";
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
  async getAll(params?: FetchConcoursParams): Promise<any> {
    const { data } = await api.get("/concours", { params });
    return data;
  },

  async getById(id: number): Promise<Concours> {
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
  async exportPdf(params?: FetchConcoursParams): Promise<Blob> {
    const response = await api.get("/admin/concours/export/pdf", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Export des concours en Excel
   */
  async exportExcel(params?: FetchConcoursParams): Promise<Blob> {
    const response = await api.get("/admin/concours/export/excel", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Télécharger un fichier blob
   * Utilitaire pour gérer le téléchargement des exports
   */
  async downloadBlob(blob: Blob, filename: string): Promise<void> {
    // Créer un objet URL pour le blob
    const url = window.URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    
    // Simuler un clic sur le lien
    document.body.appendChild(link);
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
    const { data } = await api.get(`/spec-concours/concours/${concoursId}/documents/`);
    return data;
  },
};