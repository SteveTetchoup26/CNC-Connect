import api from "@/api/axios";

export const fetchConcours = async () => {
  const response = await api.get("/concours");
  return response.data;
};