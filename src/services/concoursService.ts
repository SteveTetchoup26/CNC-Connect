/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";

export const fetchConcours = async () => {
  const response = await api.get("/concours");
  return response.data;
};

export const fetchConcoursById = async (id: number | string) => {
  const response = await api.get(`/concours/${id}`);
  console.log(response.data)
  return response.data;
};

