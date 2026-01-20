/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { centreService, regionService, type Centre, type CentrePayload, type Region } from "@/services/centreService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  centre?: Centre | null;
};

const emptyForm: CentrePayload = {
  libelle_centre: "",
  type_centre: "CENTRE_DE_DEPÔT",
  ville_centre: "",
  capacite: 0,
  region_id: 0,
};

const CentreFormDialog = ({ open, onClose, onSuccess, centre }: Props) => {
  const [form, setForm] = useState<CentrePayload>(emptyForm);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  /* ============================
     INIT
  ============================ */
  useEffect(() => {
    regionService.getAll().then(setRegions);
  }, []);

  useEffect(() => {
    if (centre) {
      setForm({
        libelle_centre: centre.libelle_centre,
        type_centre: centre.type_centre,
        ville_centre: centre.ville_centre,
        capacite: centre.capacite,
        region_id: centre.region_id,
      });
    } else {
      setForm(emptyForm);
    }
  }, [centre, open]);

  /* ============================
     SUBMIT
  ============================ */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.libelle_centre || !form.region_id) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      if (centre) {
        await centreService.update(centre.id, form);
        toast.success("Centre modifié avec succès");
      } else {
        await centreService.create(form);
        toast.success("Centre créé avec succès");
      }

      onSuccess();
      onClose();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {centre ? "Modifier le centre" : "Ajouter un centre"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nom du centre"
            value={form.libelle_centre}
            onChange={(e) =>
              setForm({ ...form, libelle_centre: e.target.value })
            }
          />

          <Select
            value={form.type_centre}
            onValueChange={(v) =>
              setForm({ ...form, type_centre: v as any })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de centre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CENTRE_DE_DEPÔT">
                Centre de dépôt
              </SelectItem>
              <SelectItem value="CENTRE_EXAMEN">
                Centre d'examen
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Ville"
            value={form.ville_centre}
            onChange={(e) =>
              setForm({ ...form, ville_centre: e.target.value })
            }
          />

          <Input
            type="number"
            placeholder="Capacité"
            value={form.capacite}
            onChange={(e) =>
              setForm({ ...form, capacite: Number(e.target.value) })
            }
          />

          <Select
            value={String(form.region_id || "")}
            onValueChange={(v) =>
              setForm({ ...form, region_id: Number(v) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.label_region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {centre ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CentreFormDialog;