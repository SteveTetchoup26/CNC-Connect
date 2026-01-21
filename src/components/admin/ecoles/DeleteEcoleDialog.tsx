import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ecoleService } from "@/services/ecoleService";

type Props = {
  open: boolean;
  onClose: () => void;
  ecoleId: number;
  onSuccess: () => void;
};

export const DeleteEcoleDialog = ({
  open,
  onClose,
  ecoleId,
  onSuccess,
}: Props) => {
  const handleDelete = async () => {
    try {
      await ecoleService.delete(ecoleId);
      toast.success("École supprimée");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'école</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-2">
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600">
            Supprimer
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
