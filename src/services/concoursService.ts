import api from "@/api/axios";

export const fetchConcours = async () => {
  const response = await api.get("/concours");
  return response.data;
};

export const fetchConcoursById = async (id: number | string) => {
  const response = await api.get(`/concours/${id}`);
  return response.data;
};