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
import { sessionService } from "@/services/sessionService";
import { toast } from "sonner";

export const DeleteSessionDialog = ({
  open,
  onOpenChange,
  sessionId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: number;
  onSuccess: () => void;
}) => {
  const handleDelete = async () => {
    try {
      await sessionService.delete(sessionId);
      toast.success("Session supprimée");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la session ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible.
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
