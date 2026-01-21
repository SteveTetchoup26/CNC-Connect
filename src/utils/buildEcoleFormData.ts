/* eslint-disable @typescript-eslint/no-explicit-any */
import { type EcoleFormData } from "@/types/ecole";

export const buildEcoleFormData = (payload: EcoleFormData): FormData => {
  const formData = new FormData();

  /* ===================== */
  /* ====== ÉCOLE ======== */
  /* ===================== */

  Object.entries(payload.ecole).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(`ecole[${key}]`, value as any);
    }
  });

  /* ===================== */
  /* === DÉPARTEMENTS ==== */
  /* ===================== */

  payload.departements.forEach((dep, depIndex) => {
    formData.append(
      `departements[${depIndex}][libelle_departement]`,
      dep.libelle_departement
    );
    formData.append(
      `departements[${depIndex}][code_departement]`,
      dep.code_departement
    );
    formData.append(
      `departements[${depIndex}][description_departement]`,
      dep.description_departement
    );

    dep.filieres.forEach((fil, filIndex) => {
      formData.append(
        `departements[${depIndex}][filieres][${filIndex}][libelle_filiere]`,
        fil.libelle_filiere
      );
      formData.append(
        `departements[${depIndex}][filieres][${filIndex}][code_filiere]`,
        fil.code_filiere || ""
      );
      formData.append(
        `departements[${depIndex}][filieres][${filIndex}][description_filiere]`,
        fil.description_filiere || ""
      );

      fil.niveaux.forEach((niv, nivIndex) => {
        formData.append(
          `departements[${depIndex}][filieres][${filIndex}][niveaux][${nivIndex}][libelle_niveau]`,
          niv.libelle_niveau
        );

        if (niv.id) {
          formData.append(
            `departements[${depIndex}][filieres][${filIndex}][niveaux][${nivIndex}][id]`,
            String(niv.id)
          );
        }

        niv.matieres.forEach((matiere, matIndex) => {
          formData.append(
            `departements[${depIndex}][filieres][${filIndex}][niveaux][${nivIndex}][matieres][${matIndex}][libelle_matiere]`,
            matiere.libelle_matiere
          );
          
          if (matiere.id) {
            formData.append(
              `departements[${depIndex}][filieres][${filIndex}][niveaux][${nivIndex}][matieres][${matIndex}][id]`,
              String(matiere.id)
            );
          }
          
          if (matiere.code_matiere) {
            formData.append(
              `departements[${depIndex}][filieres][${filIndex}][niveaux][${nivIndex}][matieres][${matIndex}][code_matiere]`,
              matiere.code_matiere
            );
          }
        });
      });
    });
  });

  return formData;
};