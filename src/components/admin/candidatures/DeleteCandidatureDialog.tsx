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

export const DeleteCandidatureDialog = ({
  open,
  onOpenChange,
  candidature,
  onSuccess,
}: Props) => {
  const handleDelete = async () => {
    // Vérifier si la candidature peut être supprimée
    const statutsNonSupprimables = ["APPROUVEE", "REJETEE", "VALIDEE"];
    
    if (statutsNonSupprimables.includes(candidature.statut)) {
      toast.error(
        "Impossible de supprimer cette candidature. Les candidatures validées, approuvées ou rejetées ne peuvent pas être supprimées."
      );
      return;
    }

    try {
      await candidatureService.delete(candidature.id);
      toast.success("Candidature supprimée avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    }
  };

  const canDelete = !["APPROUVEE", "REJETEE", "VALIDEE"].includes(
    candidature.statut
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                Êtes-vous sûr de vouloir supprimer la candidature de{" "}
                <strong>
                  {candidature.candidat?.utilisateur?.nom}{" "}
                  {candidature.candidat?.utilisateur?.prenom}
                </strong>{" "}
                pour le concours{" "}
                <strong>{candidature.concours?.libelle_concours}</strong> ?
                <br />
                <br />
                Cette action est <strong>irréversible</strong> et supprimera
                également toutes les données associées (historique,
                notifications, etc.).
              </>
            ) : (
              <>
                Impossible de supprimer cette candidature.
                <br />
                <br />
                Les candidatures avec le statut{" "}
                <strong>{candidature.statut}</strong> ne peuvent pas être
                supprimées.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {canDelete ? "Annuler" : "Fermer"}
          </AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};