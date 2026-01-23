/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { candidatureService } from "@/services/candidatureService";
import type { Candidature } from "@/types/candidature";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidature: Candidature;
  onSuccess: () => void;
};

export const ValiderCandidatureDialog = ({
  open,
  onOpenChange,
  candidature,
  onSuccess,
}: Props) => {
  const handleValider = async () => {
    try {
      const response = await candidatureService.valider(candidature.id);
      toast.success(`Candidature validée ! Code définitif : ${response.code_definitif}`);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la validation"
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Valider la candidature</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir valider la candidature de{" "}
            <strong>
              {candidature.candidat?.utilisateur?.nom}{" "}
              {candidature.candidat?.utilisateur?.prenom}
            </strong>{" "}
            pour le concours{" "}
            <strong>{candidature.concours?.libelle_concours}</strong> ?
            <br />
            <br />
            Un code candidat définitif sera généré et un email de confirmation
            sera envoyé au candidat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleValider}
            className="bg-green-600 hover:bg-green-700"
          >
            Valider
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};