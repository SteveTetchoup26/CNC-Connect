/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import PersonalInfo from "./steps/PersonalInfo";
import IdentityInfo from "./steps/IdentityInfo";
import FamilyInfo from "./steps/FamilyInfo";
import SchoolInfo from "./steps/SchoolInfo";
import PaymentInfo from "./steps/PaymentInfo";
import CentersInfo from "./steps/CentersInfo";

const steps = [
  "Informations perso",
  "Pièce d'identité",
  "Informations familiales",
  "Informations scolaires",
  "Paiement",
  "Centres & Validation",
];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm({
    mode: "onBlur",
    // defaultValues: {
    //   firstName: "",
    //   lastName: "",
    //   phone: "",
    //   // ➜ complète ici au fur et à mesure
    // },
  });

  const next = async () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = (data: any) => {
    console.log("INSCRIPTION COMPLETE :", data);
    // dispatch redux / api ici
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full mx-auto p-4 md:p-4"
      >
        {/* Stepper */}
        <div className="mb-10">
          <div className="flex gap-4 justify-between">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`
                flex-1 min-w-32.5
                ${index === currentStep ? "block" : "hidden"}
                lg:block
                `}>
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

          {/* Indicateur mobile */}
          <div className="mt-2 text-center text-sm text-gray-500 lg:hidden">
            Étape {currentStep + 1} / {steps.length}
          </div>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-2xl shadow p-6 md:p-10">
          {currentStep === 0 && <PersonalInfo />}
          {currentStep === 1 && <IdentityInfo />}
          {currentStep === 2 && <FamilyInfo />}
          {currentStep === 3 && <SchoolInfo />}
          {currentStep === 4 && <PaymentInfo />}
          {currentStep === 5 && <CentersInfo />}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-lg border disabled:opacity-50 cursor-pointer"
            >
              Précédent
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 rounded-lg bg-secondary text-white cursor-pointer"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-green-600 text-white cursor-pointer"
              >
                Soumettre
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Stepper;
