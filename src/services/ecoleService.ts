/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/api/axios";
import { type Ecole, type EcoleFormData } from "@/types/ecole";
import { buildEcoleFormData } from "@/utils/buildEcoleFormData";

/* ===================== */
/* ======= LISTE ======= */
/* ===================== */

export const ecoleService = {
  async getAll(): Promise<Ecole[]> {
    const { data } = await api.get("/admin/ecoles");
    return data;
  },

  async getById(id: number): Promise<any> {
    const { data } = await api.get(`/admin/ecoles/${id}`);
    return data;
  },

  /* ===================== */
  /* ====== CREATE ======= */
  /* ===================== */

  async create(payload: EcoleFormData): Promise<Ecole> {
    const formData = buildEcoleFormData(payload);

    const { data } = await api.post("/admin/ecoles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  /* ===================== */
  /* ====== UPDATE ======= */
  /* ===================== */

  async update(id: number, payload: EcoleFormData): Promise<Ecole> {
    const formData = buildEcoleFormData(payload);

    const { data } = await api.post(
      `/admin/ecoles/${id}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  /* ===================== */
  /* ====== DELETE ======= */
  /* ===================== */

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/ecoles/${id}`);
  },
};
