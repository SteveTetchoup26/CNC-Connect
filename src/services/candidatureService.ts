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

// src/services/candidatureService.ts
export const downloadFiche = async (candidatureId: number) => {
  const response = await axios.get(`http://localhost:8000/api/candidature/${candidatureId}/fiche/download`, {
    responseType: 'blob', // Important : contourne IDM
  });
  
  // Créer un lien temporaire pour télécharger
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