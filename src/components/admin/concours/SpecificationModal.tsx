/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { specificationService } from "@/services/concoursService";
import type { SpecificationConcours, SpecificationFormData } from "@/types/concours";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concoursId: number;
  onSuccess: () => void;
  onClose: () => void;
};

const DOCUMENTS = [
  { key: "carte_nationale_identite", label: "Carte Nationale d'Identité" },
  { key: "diplomes", label: "Diplômes" },
  { key: "certificat_nationalite", label: "Certificat de Nationalité" },
  { key: "releve_notes", label: "Relevé de Notes" },
  { key: "acte_naissance", label: "Acte de Naissance" },
  { key: "photo", label: "Photo d'identité" },
] as const;

export const SpecificationModal = ({
  open,
  onOpenChange,
  concoursId,
  onSuccess,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [existingSpec, setExistingSpec] = useState<SpecificationConcours | null>(null);

  const [formData, setFormData] = useState<SpecificationFormData>({
    concours_id: concoursId,
    desc_infos_concours: "",
    carte_nationale_identite: false,
    diplomes: false,
    certificat_nationalite: false,
    releve_notes: false,
    acte_naissance: false,
    photo: false,
  });

  // Charger les spécifications existantes
  useEffect(() => {
    const loadSpecification = async () => {
      if (!open || !concoursId) return;

      try {
        const spec = await specificationService.getByConcours(concoursId);
        setExistingSpec(spec);
        setFormData({
          concours_id: concoursId,
          desc_infos_concours: spec.desc_infos_concours || "",
          carte_nationale_identite: spec.carte_nationale_identite,
          diplomes: spec.diplomes,
          certificat_nationalite: spec.certificat_nationalite,
          releve_notes: spec.releve_notes,
          acte_naissance: spec.acte_naissance,
          photo: spec.photo,
        });
      } catch (error) {
        // Pas de spécification existante, on garde les valeurs par défaut
        setExistingSpec(null);
        setFormData({
          concours_id: concoursId,
          desc_infos_concours: "",
          carte_nationale_identite: false,
          diplomes: false,
          certificat_nationalite: false,
          releve_notes: false,
          acte_naissance: false,
          photo: false,
        });
      }
    };

    loadSpecification();
  }, [open, concoursId]);

  const handleCheckboxChange = (key: keyof SpecificationFormData, checked: boolean) => {
    setFormData({ ...formData, [key]: checked });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (existingSpec?.id) {
        await specificationService.update(existingSpec.id, formData);
        toast.success("Spécifications mises à jour avec succès");
      } else {
        await specificationService.create(formData);
        toast.success("Spécifications créées avec succès");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {existingSpec ? "Modifier les spécifications" : "Ajouter des spécifications"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <Label>Description / Informations complémentaires</Label>
            <Textarea
              value={formData.desc_infos_concours}
              onChange={(e) =>
                setFormData({ ...formData, desc_infos_concours: e.target.value })
              }
              placeholder="Informations importantes sur le concours..."
              rows={4}
            />
          </div>

          {/* Documents requis */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Documents requis
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Cochez les documents que les candidats devront fournir lors de l'inscription
            </p>

            <div className="space-y-3">
              {DOCUMENTS.map((doc) => (
                <div key={doc.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={doc.key}
                    checked={formData[doc.key]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(doc.key, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={doc.key}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {doc.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Résumé des documents sélectionnés :</p>
            <ul className="text-sm space-y-1">
              {DOCUMENTS.filter((doc) => formData[doc.key]).map((doc) => (
                <li key={doc.key} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {doc.label}
                </li>
              ))}
              {DOCUMENTS.filter((doc) => formData[doc.key]).length === 0 && (
                <li className="text-muted-foreground italic">
                  Aucun document sélectionné
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {existingSpec ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};