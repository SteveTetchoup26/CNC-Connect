import api from "@/api/axios";
import { type Utilisateur, type UtilisateurFormData, type Role } from "@/types/utilisateur";

/* ===================== */
/* == UTILISATEURS ===== */
/* ===================== */

export const utilisateurService = {
  async getAll(): Promise<Utilisateur[]> {
    const { data } = await api.get("/admin/utilisateurs");
    return data;
  },

  async getById(id: number): Promise<Utilisateur> {
    const { data } = await api.get(`/admin/utilisateurs/${id}`);
    return data;
  },

  async create(payload: UtilisateurFormData): Promise<Utilisateur> {
    const { data } = await api.post("/admin/utilisateurs", payload);
    return data;
  },

  async update(id: number, payload: Partial<UtilisateurFormData>): Promise<Utilisateur> {
    const { data } = await api.put(`/admin/utilisateurs/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/utilisateurs/${id}`);
  },
};

/* ===================== */
/* ====== ROLES ======== */
/* ===================== */

export const roleService = {
  async getAll(): Promise<Role[]> {
    const { data } = await api.get("/admin/roles");
    return data;
  },
};