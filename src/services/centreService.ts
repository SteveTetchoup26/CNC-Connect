import api from "@/api/axios";

export type Region = {
  id: number;
  label_region: string;
};

export type Centre = {
  id: number;
  libelle_centre: string;
  type_centre: "CENTRE_DE_DEPÔT" | "CENTRE_EXAMEN";
  ville_centre: string;
  capacite: number;
  region_id: number;
  region?: Region;
};

export type CentrePayload = {
  libelle_centre: string;
  type_centre: Centre["type_centre"];
  ville_centre: string;
  capacite: number;
  region_id: number;
};

/* ============================
   CENTRES
============================ */

export const centreService = {
  getAll: async (): Promise<Centre[]> => {
    const { data } = await api.get("/centres");
    return data;
  },

  getById: async (id: number): Promise<Centre> => {
    const { data } = await api.get(`/admin/centres/${id}`);
    return data;
  },

  create: async (payload: CentrePayload) => {
    const { data } = await api.post("/admin/centres", payload);
    return data;
  },

  update: async (id: number, payload: CentrePayload) => {
    const { data } = await api.put(`/admin/centres/${id}`, payload);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/admin/centres/${id}`);
    return data;
  },

  getByType: async (type: Centre["type_centre"]): Promise<Centre[]> => {
    const { data } = await api.get(`/centres/type/${type}`);
    return data;
  },

  getByTypeAndRegion: async (
    type: Centre["type_centre"],
    regionId: number
  ): Promise<Centre[]> => {
    const { data } = await api.get(
      `/admin/centres/type/${type}/region/${regionId}`
    );
    return data;
  },
};

/* ============================
   REGIONS
============================ */

export const regionService = {
  getAll: async (): Promise<Region[]> => {
    const { data } = await api.get("/admin/regions");
    return data;
  },
};