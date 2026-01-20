import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { centreService } from "@/services/centreService";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  centreId: number | null;
  onSuccess: () => void;
};

const DeleteCentreDialog = ({ open, onClose, centreId, onSuccess }: Props) => {
  const handleDelete = async () => {
    if (!centreId) return;

    try {
      await centreService.delete(centreId);
      toast.success("Centre supprimé");
      onSuccess();
      onClose();
    } catch {
      toast.error("Impossible de supprimer le centre");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le centre</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Voulez-vous continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCentreDialog;
