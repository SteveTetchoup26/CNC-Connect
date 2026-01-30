/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InscriptionData, InscriptionResponse } from "@/types";
import api from "@/api/axios";



export const inscriptionService = {
  async inscrireConcours(data: FormData): Promise<InscriptionResponse> {


    try {
      const response = await api.post<InscriptionResponse>(
        `/inscription-concours`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      // Gérer les erreurs
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Si c'est une erreur de validation Laravel
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        throw new Error('Une erreur est survenue lors de l\'inscription');
      }
    }
  },
};