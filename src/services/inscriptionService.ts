/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InscriptionData, InscriptionResponse } from "@/types";
import api from "@/api/axios";



export const inscriptionService = {
  async inscrireConcours(data: InscriptionData): Promise<InscriptionResponse> {
    // Créer un FormData pour envoyer les fichiers
    const formData = new FormData();

    // Ajouter tous les champs au FormData
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof InscriptionData];
      
      // Gérer les fichiers
      if (key === 'photo' || key === 'fiche_paiement') {
        if (value && value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        }
      } 
      // Gérer les autres champs
      else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    try {
      const response = await api.post<InscriptionResponse>(
        `/inscription-concours`,
        formData,
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