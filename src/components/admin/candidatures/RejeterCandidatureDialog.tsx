/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { candidatureService } from "@/services/candidatureService";
import type { Candidature } from "@/types/candidature";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidature: Candidature;
  onSuccess: () => void;
};

export const RejeterCandidatureDialog = ({
  open,
  onOpenChange,
  candidature,
  onSuccess,
}: Props) => {
  const [motifRejet, setMotifRejet] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRejeter = async () => {
    if (motifRejet.trim().length < 10) {
      toast.error("Le motif doit contenir au moins 10 caractères");
      return;
    }

    try {
      setLoading(true);
      await candidatureService.rejeter(candidature.id, {
        motif_rejet: motifRejet,
      });
      toast.success("Candidature rejetée");
      onSuccess();
      onOpenChange(false);
      setMotifRejet("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du rejet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeter la candidature</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Vous êtes sur le point de rejeter la candidature de{" "}
              <strong>
                {candidature.candidat?.utilisateur?.nom}{" "}
                {candidature.candidat?.utilisateur?.prenom}
              </strong>
              .
            </p>
          </div>

          <div>
            <Label htmlFor="motif">Motif du rejet *</Label>
            <Textarea
              id="motif"
              value={motifRejet}
              onChange={(e) => setMotifRejet(e.target.value)}
              placeholder="Expliquez la raison du rejet (minimum 10 caractères)..."
              rows={5}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {motifRejet.length} / 1000 caractères
            </p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Cette action est irréversible. Un email sera envoyé au candidat
              avec le motif du rejet.
            </p>
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
          <Button
            onClick={handleRejeter}
            disabled={loading || motifRejet.trim().length < 10}
            className="bg-red-600 hover:bg-red-700"
          >
            Rejeter la candidature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};