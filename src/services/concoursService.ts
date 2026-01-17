/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";
import type { FetchConcoursParams } from "@/types";

export const fetchConcours = async (params: FetchConcoursParams) => {
  const response = await api.get("/concours", { params });
  return response.data;
};

export const fetchConcoursById = async (id: number | string) => {
  const response = await api.get(`/concours/${id}`);
  console.log(response.data)
  return response.data;
};

