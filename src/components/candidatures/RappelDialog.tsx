/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/candidatures/RappelDialog.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { definirRappel } from "@/store/candidature/candidatureSlice";

interface Candidature {
  id: number;
  statut: string;
  concours: {
    libelle_concours: string;
    date_examen: string;
  };
}

interface RappelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidature: Candidature | null;
  onSuccess?: () => void;
}

const RappelDialog = ({
  open,
  onOpenChange,
  candidature,
  onSuccess,
}: RappelDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rappelDate, setRappelDate] = useState("");
  const [rappelHeure, setRappelHeure] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSubmit = async () => {
    if (!candidature || !rappelDate || !rappelHeure) {
      toast.error("Erreur", {
        description: "Veuillez renseigner la date et l'heure du rappel"
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(
        definirRappel({
          candidatureId: candidature.id,
          data: {
            date_rappel: rappelDate,
            heure_rappel: rappelHeure,
          },
        })
      ).unwrap();

      toast.success("Rappel défini", {
        description: `Vous recevrez un email le ${formatDate(rappelDate)} à ${rappelHeure}`
      });

      // Réinitialiser les champs
      setRappelDate("");
      setRappelHeure("");
      
      // Fermer le dialog
      onOpenChange(false);

      // Callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error("Erreur", {
        description: error || "Impossible de définir le rappel"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRappelDate("");
    setRappelHeure("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Définir un rappel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Recevez un email de rappel avant votre concours
          </p>

          {candidature && (
            <div className="bg-gray-50 dark:bg-gray-300 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">
                {candidature.concours.libelle_concours}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Date de l'examen : {formatDate(candidature.concours.date_examen)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Date du rappel</label>
            <Input
              type="date"
              value={rappelDate}
              onChange={(e) => setRappelDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={candidature?.concours.date_examen}
            />
            <p className="text-xs text-gray-500">
              La date doit être avant le jour de l'examen
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heure du rappel</label>
            <Input
              type="time"
              value={rappelHeure}
              onChange={(e) => setRappelHeure(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Enregistrement..." : "Définir le rappel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RappelDialog;