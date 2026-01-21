import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { type Ecole, type EcoleFormData } from "@/types/ecole";
import { ecoleService } from "@/services/ecoleService";

import { StepEcoleInfos } from "./steps/StepEcoleInfos";
import { StepDepartements } from "./steps/StepDepartements";
import { StepFilieresNiveaux } from "./steps/StepFilieresNiveaux";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ecole?: Ecole | null;
  onSuccess: () => void;
  onClose: () => void;
};

const STEPS = ["École", "Départements", "Filières & Niveaux"];

export const EcoleModal = ({
  open,
  onOpenChange,
  ecole,
  onSuccess,
  onClose,
}: Props) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EcoleFormData>({
    ecole: {
      libelle_ecole: "",
      code_ecole: "",
      localisation: "",
      email_ecole: "",
    },
    departements: [],
  });

  useEffect(() => {
    if (ecole) {
      setFormData({
        ecole: {
          libelle_ecole: ecole.libelle_ecole,
          code_ecole: ecole.code_ecole,
          localisation: ecole.localisation,
          email_ecole: ecole.email_ecole,
          telephone_ecole: ecole.telephone_ecole,
          bp_ecole: ecole.bp_ecole,
          siteweb_ecole: ecole.siteweb_ecole,
          devise: ecole.devise,
        },
        departements: ecole.departements || [],
      });
    } else {
      setFormData({
        ecole: {
          libelle_ecole: "",
          code_ecole: "",
          localisation: "",
          email_ecole: "",
        },
        departements: [],
      });
    }
    setStep(0);
  }, [ecole, open]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (ecole?.id) {
        await ecoleService.update(ecole.id, formData);
        toast.success("École mise à jour avec succès");
      } else {
        await ecoleService.create(formData);
        toast.success("École créée avec succès");
      }

      onSuccess();
      onClose();
      setStep(0);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {ecole ? "Modifier une école" : "Créer une école"}
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-4 mb-4">
          {STEPS.map((label, i) => (
            <div
              key={i}
              className={`text-sm font-medium ${
                i === step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {/* Steps Container - Correction ici */}
        <div className="relative h-125 overflow-hidden overflow-y-auto">
          <div
            className="flex h-full transition-transform duration-300"
            style={{ transform: `translateX(-${step * 100}%)` }}
          >
            {/* Chaque étape prend 100% de la largeur du conteneur */}
            <div className="w-full flex-shrink-0 p-1">
              <StepEcoleInfos data={formData} setData={setFormData} />
            </div>
            <div className="w-full flex-shrink-0 p-1">
              <StepDepartements data={formData} setData={setFormData} />
            </div>
            <div className="w-full flex-shrink-0 p-1">
              <StepFilieresNiveaux data={formData} setData={setFormData} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" disabled={step === 0} onClick={prev}>
            Précédent
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Suivant</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {ecole ? "Mettre à jour" : "Créer"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};