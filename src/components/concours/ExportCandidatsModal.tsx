import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUp, FileSpreadsheet, Users } from "lucide-react";
import { toast } from "sonner";
import { concoursService } from "@/services/concoursService";

type ConcoursAvecCandidats = {
  id: number;
  libelle_concours: string;
  date_examen: string;
  candidatures_count: number;
  session?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

export const ExportCandidatsModal = ({ open, onClose }: Props) => {
  const [concoursList, setConcoursList] = useState<ConcoursAvecCandidats[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedConcoursId, setSelectedConcoursId] = useState<string>("");

  useEffect(() => {
    if (open) {
      loadConcours();
    }
  }, [open]);

  const loadConcours = async () => {
    try {
      setLoading(true);
      const data = await concoursService.getConcoursAvecCandidats();
      setConcoursList(data);
      
      if (data.length === 0) {
        toast.info("Aucun concours avec des candidats trouvé");
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des concours");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!selectedConcoursId) {
      toast.error("Veuillez sélectionner un concours");
      return;
    }

    try {
      setExporting(true);
      const blob = await concoursService.exportCandidatsPdf(Number(selectedConcoursId));
      
      const selectedConcours = concoursList.find(c => c.id === Number(selectedConcoursId));
      const filename = `candidats-${selectedConcours?.libelle_concours.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
      
      await concoursService.downloadBlob(blob, filename);
      onClose();

    } catch (error) {
      console.error(error);
      onClose();
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!selectedConcoursId) {
      toast.error("Veuillez sélectionner un concours");
      return;
    }

    try {
      setExporting(true);
      const blob = await concoursService.exportCandidatsExcel(Number(selectedConcoursId));
      
      const selectedConcours = concoursList.find(c => c.id === Number(selectedConcoursId));
      const filename = `candidats-${selectedConcours?.libelle_concours.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      
      await concoursService.downloadBlob(blob, filename);
      onClose();
      
    } catch (error) {
    //   toast.error("Erreur lors de l'export Excel");
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const selectedConcours = concoursList.find(c => c.id === Number(selectedConcoursId));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter la liste des candidats</DialogTitle>
          <DialogDescription>
            Sélectionnez un concours pour exporter la liste de ses candidats
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection du concours */}
          <div>
            <Label htmlFor="concours">Concours *</Label>
            <Select
              value={selectedConcoursId}
              onValueChange={setSelectedConcoursId}
              disabled={loading}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un concours"} />
              </SelectTrigger>
              <SelectContent>
                {concoursList.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Aucun concours avec des candidats
                  </div>
                ) : (
                  concoursList.map((concours) => (
                    <SelectItem key={concours.id} value={String(concours.id)}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{concours.libelle_concours}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({concours.candidatures_count} candidat{concours.candidatures_count > 1 ? 's' : ''})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Infos du concours sélectionné */}
          {selectedConcours && (
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {selectedConcours.candidatures_count} candidat{selectedConcours.candidatures_count > 1 ? 's' : ''}
                </span>
              </div>
              {selectedConcours.session && (
                <p className="text-sm text-muted-foreground">
                  Session : {selectedConcours.session}
                </p>
              )}
            </div>
          )}

          {/* Boutons d'export */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleExportPdf}
              disabled={!selectedConcoursId || exporting}
              className="w-full"
              variant="outline"
            >
              <FileUp className="h-4 w-4 mr-2 text-red-500" />
              {exporting ? "Export en cours..." : "Exporter en PDF"}
            </Button>

            <Button
              onClick={handleExportExcel}
              disabled={!selectedConcoursId || exporting}
              className="w-full"
              variant="outline"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
              {exporting ? "Export en cours..." : "Exporter en Excel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};