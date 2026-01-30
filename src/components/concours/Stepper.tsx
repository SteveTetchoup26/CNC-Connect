/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, AlertCircle } from "lucide-react";
import PersonalInfo from "./steps/PersonalInfo";
import IdentityInfo from "./steps/IdentityInfo";
import FamilyInfo from "./steps/FamilyInfo";
import SchoolInfo from "./steps/SchoolInfo";
import PaymentInfo from "./steps/PaymentInfo";
import CentersInfo from "./steps/CentersInfo";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { inscriptionService } from "@/services/inscriptionService";
// import type { InscriptionData } from "@/types";
import PreviewStep from "./steps/PreviewStep";

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const steps = [
    "Informations perso",
    "Pièce d'identité",
    "Informations familiales",
    "Informations scolaires",
    "Paiement",
    "Centres & Validation",
  ];

  const requiredFieldsByStep = {
    0: [
      "nom",
      "prenom",
      "adresse",
      "nationalite",
      "sexe",
      "date_naissance",
      "lieu_naissance",
      "region_origine",
      "departement_origine",
      "ville_origine",
      "statut_matrimonial",
      "photo",
    ],
    1: ["numero_cni", "date_delivrance_cni"],
    2: ["nom_mere", "telephone_mere", "nom_pere", "telephone_pere"],
    3: [
      "niveau_scolaire",
      "filiere_origine",
      "diplome_admission",
      "mention",
      "annee_diplome",
    ],
    4: ["num_recu", "fiche_paiement"],
    5: ["centre_depot_id", "centre_examen_id"],
  };

  const methods = useForm({
    mode: "onBlur",
  });

  const next = async () => {
    // Valider les champs de l'étape actuelle avant de passer à la suivante
    const currentRequiredFields =
      requiredFieldsByStep[currentStep as keyof typeof requiredFieldsByStep];

    // Vérifier si tous les champs requis sont remplis
    const formValues = methods.getValues();
    const missingFields = currentRequiredFields.filter((field) => {
      const value = formValues[field];

      // Gestion spéciale pour les champs de fichier
      if (field === "photo" || field === "fiche_paiement") {
        // Pour les fichiers, vérifier si un fichier a été sélectionné
        const fileInput = document.querySelector(
          `[name="${field}"]`,
        ) as HTMLInputElement;
        return !fileInput || fileInput.files?.length === 0;
      }

      // Pour les autres champs, vérifier si la valeur est vide
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      toast.error("Champs manquants", {
        description: `Veuillez remplir tous les champs requis avant de continuer.`,
        duration: 3000,
      });
      return;
    }

    // Si validation réussie, passer à l'étape suivante
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      setCurrentStep((s) => Math.max(s - 1, 0));
    }
  };

  const isFieldEmpty = (fieldName: string, formValues: any): boolean => {
    const value = formValues[fieldName];

    // Gestion spéciale pour les champs de fichier
    if (fieldName === "photo" || fieldName === "fiche_paiement") {
      // Vérifier si un fichier a été stocké dans le formulaire
      return !value; // value sera un objet File si un fichier a été sélectionné
    }

    // Pour les autres champs, vérifier si la valeur est vide
    return value === undefined || value === null || value === "";
  };

  const validateAllSteps = () => {
    const formValues = methods.getValues();
    const allMissingFields = [];

    // Vérifier tous les champs requis pour toutes les étapes
    for (const [step, fields] of Object.entries(requiredFieldsByStep)) {
      const missingFieldsInStep = fields.filter((field) =>
        isFieldEmpty(field, formValues),
      );

      if (missingFieldsInStep.length > 0) {
        allMissingFields.push({
          step: parseInt(step),
          fields: missingFieldsInStep,
        });
      }
    }

    return allMissingFields;
  };

  const handlePreSubmit = () => {
    // Valider tous les champs avant d'afficher la prévisualisation
    const missingFieldsByStep = validateAllSteps();

    if (missingFieldsByStep.length > 0) {
      // Formatter les noms des champs pour l'affichage
      const fieldLabels: Record<string, string> = {
        nom: "Nom",
        prenom: "Prénom",
        adresse: "Adresse",
        nationalite: "Nationalité",
        sexe: "Sexe",
        date_naissance: "Date de naissance",
        lieu_naissance: "Lieu de naissance",
        region_origine: "Région d'origine",
        departement_origine: "Département d'origine",
        ville_origine: "Ville d'origine",
        statut_matrimonial: "Statut matrimonial",
        photo: "Photo",
        numero_cni: "Numéro CNI",
        date_delivrance_cni: "Date de délivrance CNI",
        nom_mere: "Nom de la mère",
        telephone_mere: "Téléphone de la mère",
        nom_pere: "Nom du père",
        telephone_pere: "Téléphone du père",
        niveau_scolaire: "Niveau scolaire",
        filiere_origine: "Filière d'origine",
        diplome_admission: "Diplôme d'admission",
        mention: "Mention",
        annee_diplome: "Année du diplôme",
        num_recu: "Numéro de reçu",
        fiche_paiement: "Fiche de paiement",
        centre_depot_id: "Centre de dépôt",
        centre_examen_id: "Centre d'examen",
      };

      toast.error("Formulaire incomplet", {
        description: (
          <div className="space-y-2">
            <p className="font-semibold">
              Veuillez remplir les champs suivants:
            </p>
            {missingFieldsByStep.map(({ step, fields }) => (
              <div key={step} className="space-y-1">
                <p className="font-medium text-sm">
                  Étape {step + 1} - {steps[parseInt(step.toString())]}
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  {fields.map((field) => (
                    <li key={field}>{fieldLabels[field] || field}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ),
        duration: 10000,
        icon: <AlertCircle className="h-5 w-5" />,
      });

      // Aller à la première étape avec des champs manquants
      setCurrentStep(missingFieldsByStep[0].step);
      return;
    }

    // Si tout est valide, afficher la prévisualisation
    setShowPreview(true);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Ajouter tous les champs du formulaire
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photo" || key === "fiche_paiement") {
          // Ajouter les fichiers
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else {
          // Ajouter les autres champs
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      // Ajouter l'ID du concours
      if (id) {
        formData.append("concours_id", id);
      }

      // Utiliser formData
      const response = await inscriptionService.inscrireConcours(formData);

      toast.success(response.message, {
        duration: 5000,
      });

      if (response.download_url) {
        window.open(response.download_url, "_blank");
      }

      navigate("/mes-candidatures");
    } catch (error: any) {
      toast.error("Erreur d'inscription", {
        description:
          error.message || "Une erreur est survenue lors de l'inscription",
        duration: 5000,
      });

      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full mx-auto p-0 md:p-4">
        {!showPreview && (
          <div className="mb-10">
            {currentStep < 7 && (
              <div className="mb-8">
                <p>
                  • Le processus d’inscription est découpé en 6 étapes
                  indépendantes. Vous pouvez à tout moment revenir à l’étape
                  précédente. La validation définitive se fera en étape 6.
                </p>
                <p>
                  • La présence d’une astérisque{" "}
                  <span className="text-secondary">*</span> indique que le champ
                  est obligatoire.
                </p>
              </div>
            )}
            <div className="flex gap-4 justify-between">
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={`
                    flex-1 min-w-32.5
                    ${index === currentStep ? "block" : "hidden"}
                    xl:block
                  `}
                >
                  <div
                    className={`rounded-full px-3 py-2 text-center text-sm font-medium transition-all
                      ${
                        index === currentStep
                          ? "bg-secondary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-center text-sm text-gray-500 xl:hidden">
              Étape {currentStep + 1} / {steps.length}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-transparent rounded-2xl shadow p-1 md:p-10">
          {showPreview ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Prévisualisation de votre inscription
              </h2>
              <PreviewStep data={methods.watch()} />
            </>
          ) : (
            <>
              {currentStep === 0 && <PersonalInfo />}
              {currentStep === 1 && <IdentityInfo />}
              {currentStep === 2 && <FamilyInfo />}
              {currentStep === 3 && <SchoolInfo />}
              {currentStep === 4 && <PaymentInfo />}
              {currentStep === 5 && <CentersInfo />}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0 && !showPreview}
              className="px-6 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              {showPreview ? "Modifier" : "Précédent"}
            </button>

            {showPreview ? (
              <button
                type="button"
                onClick={() => methods.handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Soumission...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    S'inscire
                  </>
                )}
              </button>
            ) : currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 rounded-lg bg-secondary text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePreSubmit}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Prévisualiser
              </button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Stepper;
