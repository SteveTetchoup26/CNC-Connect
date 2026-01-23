/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"; // Ajouter DialogDescription
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { candidatureService } from "@/services/candidatureService";
import { centreService } from "@/services/centreService";
import type { Candidature, Centre } from "@/types/candidature";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidature: Candidature | null;
  onSuccess: () => void;
};

export const AffecterCentresDialog = ({
  open,
  onOpenChange,
  candidature,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [centreDepotId, setCentreDepotId] = useState<string>("");
  const [centreExamenId, setCentreExamenId] = useState<string>("");

  useEffect(() => {
    const loadCentres = async () => {
      try {
        const data = await centreService.getAll();
        setCentres(data);

        // Pré-remplir avec les valeurs existantes
        if (candidature?.centre_depot_id) {
          setCentreDepotId(String(candidature.centre_depot_id));
        } else {
          setCentreDepotId("none"); // Utiliser "none" au lieu de ""
        }
        
        if (candidature?.centre_examen_id) {
          setCentreExamenId(String(candidature.centre_examen_id));
        } else {
          setCentreExamenId("none"); // Utiliser "none" au lieu de ""
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des centres");
      }
    };

    if (open && candidature) {
      loadCentres();
    }
  }, [open, candidature]);

  const centresDepot = centres.filter((c) => c.type_centre === "CENTRE_DE_DEPÔT");
  const centresExamen = centres.filter((c) => c.type_centre === "CENTRE_EXAMEN");

  const handleAffecter = async () => {
    if (!candidature) return;

    const payload: any = {};

    // Convertir "none" en null ou undefined
    if (centreDepotId && centreDepotId !== "none") {
      payload.centre_depot_id = Number(centreDepotId);
    } else {
      payload.centre_depot_id = null; // Pour supprimer l'affectation
    }
    
    if (centreExamenId && centreExamenId !== "none") {
      payload.centre_examen_id = Number(centreExamenId);
    } else {
      payload.centre_examen_id = null; // Pour supprimer l'affectation
    }

    // Vérifier qu'au moins un centre est sélectionné (pas "none")
    const hasCentreDepot = centreDepotId !== "none" && centreDepotId !== "";
    const hasCentreExamen = centreExamenId !== "none" && centreExamenId !== "";
    
    if (!hasCentreDepot && !hasCentreExamen) {
      toast.error("Veuillez sélectionner au moins un centre");
      return;
    }

    try {
      setLoading(true);
      await candidatureService.affecterCentres(candidature.id, payload);
      toast.success("Centres affectés avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'affectation"
      );
    } finally {
      setLoading(false);
    }
  };

  // Ne pas rendre le dialog si pas de candidature
  if (!candidature) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Affecter des centres</DialogTitle>
          <DialogDescription>
            Affectez un centre de dépôt et/ou d'examen pour cette candidature
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Candidat :{" "}
              <strong>
                {candidature.candidat?.utilisateur?.nom}{" "}
                {candidature.candidat?.utilisateur?.prenom}
              </strong>
            </p>
          </div>

          <div>
            <Label htmlFor="centre-depot">Centre de dépôt</Label>
            <Select value={centreDepotId} onValueChange={setCentreDepotId}>
              <SelectTrigger id="centre-depot" className="mt-2">
                <SelectValue placeholder="Sélectionner un centre de dépôt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun centre de dépôt</SelectItem>
                {centresDepot.map((centre) => (
                  <SelectItem key={centre.id} value={String(centre.id)}>
                    {centre.libelle_centre} - {centre.ville_centre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="centre-examen">Centre d'examen</Label>
            <Select value={centreExamenId} onValueChange={setCentreExamenId}>
              <SelectTrigger id="centre-examen" className="mt-2">
                <SelectValue placeholder="Sélectionner un centre d'examen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun centre d'examen</SelectItem>
                {centresExamen.map((centre) => (
                  <SelectItem key={centre.id} value={String(centre.id)}>
                    {centre.libelle_centre} - {centre.ville_centre} (
                    {centre.capacite} places)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button onClick={handleAffecter} disabled={loading}>
            {loading ? "Chargement..." : "Affecter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};