import api from "@/api/axios";

export const fetchCentresByType = async (type: "CENTRE_DE_DEPÔT" | "CENTRE_EXAMEN") => {
  const res = await api.get(`/centres/type/${type}`);
  return res.data;
};
