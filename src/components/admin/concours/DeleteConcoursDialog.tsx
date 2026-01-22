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
import { concoursService } from "@/services/concoursService";

type Props = {
  open: boolean;
  concoursId: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

export const DeleteConcoursDialog = ({
  open,
  concoursId,
  onClose,
  onSuccess,
}: Props) => {
  const handleDelete = async () => {
    if (!concoursId) return;

    try {
      await concoursService.delete(concoursId);
      toast.success("Concours supprimé avec succès");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce concours ? Cette action est
            irréversible et supprimera également toutes les données associées
            (frais, spécifications, etc.).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};