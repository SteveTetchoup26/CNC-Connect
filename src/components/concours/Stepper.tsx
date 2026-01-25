/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle } from "lucide-react";
import PersonalInfo from "./steps/PersonalInfo";
import IdentityInfo from "./steps/IdentityInfo";
import FamilyInfo from "./steps/FamilyInfo";
import SchoolInfo from "./steps/SchoolInfo";
import PaymentInfo from "./steps/PaymentInfo";
import CentersInfo from "./steps/CentersInfo";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { inscriptionService } from "@/services/inscriptionService";
import type { InscriptionData } from "@/types";
import PreviewStep from "./steps/PreviewStep";

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams(); // Dans le composant Stepper
  

  const steps = [
    "Informations perso",
    "Pièce d'identité",
    "Informations familiales",
    "Informations scolaires",
    "Paiement",
    "Centres & Validation",
  ];

  const methods = useForm({
    mode: "onBlur",
  });

  const next = () => {
    setCurrentStep((s: any) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      setCurrentStep((s: any) => Math.max(s - 1, 0));
    }
  };

  const handlePreSubmit = () => {
    setShowPreview(true);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const dataWithConcours: InscriptionData = {
        ...data,
        concours_id: id,
      };

      const response = await inscriptionService.inscrireConcours(dataWithConcours);

      toast.success(response.message, {
        duration: 5000,
      });

      if (response.download_url) {
        window.open(response.download_url, '_blank');
      }

    } catch (error: any) {
      toast.error("Erreur d'inscription", {
        description: error.message || "Une erreur est survenue lors de l'inscription",
        duration: 5000,
      });

      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full mx-auto p-4 md:p-4">
        {!showPreview && (
          <div className="mb-10">
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
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
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
          <div className="flex justify-between mt-8">
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
                    Confirmer l'inscription
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
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
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
