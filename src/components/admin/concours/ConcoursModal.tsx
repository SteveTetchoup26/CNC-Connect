/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { concoursService } from "@/services/concoursService";
import { ecoleService } from "@/services/ecoleService";
import { sessionService } from "@/services/sessionService";
import type { Concours, ConcoursFormData } from "@/types/concours";
import type { Ecole } from "@/types/ecole";
import type { Session } from "@/types/concours";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concours?: Concours | null;
  onSuccess: () => void;
  onClose: () => void;
};

export const ConcoursModal = ({
  open,
  concours,
  onSuccess,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [ecoles, setEcoles] = useState<Ecole[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedEcole, setSelectedEcole] = useState<number | null>(null);

  const [formData, setFormData] = useState<ConcoursFormData>({
    libelle_concours: "",
    date_limite: "",
    date_examen: "",
    session_id: 0,
    filieres: [],
    frais_concours: {
      montant_frais: 0,
      nom_banque: "",
      numero_compte: "",
    },
  });

  // Charger les écoles et sessions
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ecolesData, sessionsData] = await Promise.all([
          ecoleService.getAll(),
          sessionService.getAll(),
        ]);
        setEcoles(ecolesData);
        setSessions(sessionsData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      }
    };

    if (open) {
      loadData();
    }
  }, [open]);

  // Charger les données du concours en mode édition
  useEffect(() => {
    if (concours && open) {
      setFormData({
        libelle_concours: concours.libelle_concours,
        date_limite: concours.date_limite.split("T")[0],
        date_examen: concours.date_examen.split("T")[0],
        session_id: concours.sessions?.[0]?.id || 0,
        filieres: concours.concours_filieres?.map((cf) => ({
          id: cf.filiere_id,
          nbre_places: cf.nbre_places,
        })) || [],
        frais_concours: {
          montant_frais: concours.frais_concours?.montant_frais || 0,
          nom_banque: concours.frais_concours?.nom_banque || "",
          numero_compte: concours.frais_concours?.numero_compte || "",
        },
      });
    } else {
      setFormData({
        libelle_concours: "",
        date_limite: "",
        date_examen: "",
        session_id: 0,
        filieres: [],
        frais_concours: {
          montant_frais: 0,
          nom_banque: "",
          numero_compte: "",
        },
      });
      setSelectedEcole(null);
    }
  }, [concours, open]);

  const selectedEcoleData = ecoles.find((e) => e.id === selectedEcole);

  const addFiliere = (filiereId: number) => {
    if (!formData.filieres.find((f) => f.id === filiereId)) {
      setFormData({
        ...formData,
        filieres: [...formData.filieres, { id: filiereId, nbre_places: 1 }],
      });
    }
  };

  const removeFiliere = (filiereId: number) => {
    setFormData({
      ...formData,
      filieres: formData.filieres.filter((f) => f.id !== filiereId),
    });
  };

  const updateNbrePlaces = (filiereId: number, nbre_places: number) => {
    setFormData({
      ...formData,
      filieres: formData.filieres.map((f) =>
        f.id === filiereId ? { ...f, nbre_places } : f
      ),
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.libelle_concours || !formData.date_limite || !formData.date_examen) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.filieres.length === 0) {
      toast.error("Veuillez sélectionner au moins une filière");
      return;
    }

    if (!formData.session_id) {
      toast.error("Veuillez sélectionner une session");
      return;
    }

    try {
      setLoading(true);

      if (concours?.id) {
        await concoursService.update(concours.id, formData);
        toast.success("Concours mis à jour avec succès");
      } else {
        await concoursService.create(formData);
        toast.success("Concours créé avec succès");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const getFiliereLabel = (filiereId: number) => {
    for (const ecole of ecoles) {
      for (const dep of ecole.departements || []) {
        const filiere = dep.filieres.find((f) => f.id === filiereId);
        if (filiere) {
          return `${filiere.libelle_filiere} (${dep.libelle_departement})`;
        }
      }
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {concours ? "Modifier le concours" : "Créer un concours"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informations générales</h3>

            <div>
              <Label>Libellé du concours *</Label>
              <Input
                value={formData.libelle_concours}
                onChange={(e) =>
                  setFormData({ ...formData, libelle_concours: e.target.value })
                }
                placeholder="Ex: Concours ENSPY 2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date limite *</Label>
                <Input
                  type="date"
                  value={formData.date_limite}
                  onChange={(e) =>
                    setFormData({ ...formData, date_limite: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Date d'examen *</Label>
                <Input
                  type="date"
                  value={formData.date_examen}
                  onChange={(e) =>
                    setFormData({ ...formData, date_examen: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Session *</Label>
              <Select
                value={String(formData.session_id)}
                onValueChange={(value) =>
                  setFormData({ ...formData, session_id: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={String(session.id)}>
                      {session.libelle_session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filières */}
          <div className="space-y-4">
            <h3 className="font-semibold">Filières et places disponibles</h3>

            <div>
              <Label>Sélectionner une école</Label>
              <Select
                value={String(selectedEcole || "")}
                onValueChange={(value) => setSelectedEcole(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une école" />
                </SelectTrigger>
                <SelectContent>
                  {ecoles.map((ecole) => (
                    <SelectItem key={ecole.id} value={String(ecole.id)}>
                      {ecole.libelle_ecole}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEcoleData && (
              <div>
                <Label>Ajouter une filière</Label>
                <Select onValueChange={(value) => addFiliere(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEcoleData.departements?.map((dep) =>
                      dep.filieres.map((filiere) => (
                        <SelectItem key={filiere.id} value={String(filiere.id)}>
                          {filiere.libelle_filiere} ({dep.libelle_departement})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Liste des filières sélectionnées */}
            <div className="space-y-2">
              {formData.filieres.map((filiere) => (
                <div
                  key={filiere.id}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  <span className="flex-1 text-sm">
                    {getFiliereLabel(filiere.id)}
                  </span>
                  <Input
                    type="number"
                    min="1"
                    value={filiere.nbre_places}
                    onChange={(e) =>
                      updateNbrePlaces(filiere.id, Number(e.target.value))
                    }
                    className="w-24"
                    placeholder="Places"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFiliere(filiere.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Frais */}
          <div className="space-y-4">
            <h3 className="font-semibold">Frais de concours</h3>

            <div>
              <Label>Montant (FCFA) *</Label>
              <Input
                type="number"
                min="0"
                value={formData.frais_concours.montant_frais}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frais_concours: {
                      ...formData.frais_concours,
                      montant_frais: Number(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom de la banque *</Label>
                <Input
                  value={formData.frais_concours.nom_banque}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frais_concours: {
                        ...formData.frais_concours,
                        nom_banque: e.target.value,
                      },
                    })
                  }
                  placeholder="Ex: BICEC"
                />
              </div>
              <div>
                <Label>Numéro de compte *</Label>
                <Input
                  value={formData.frais_concours.numero_compte}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frais_concours: {
                        ...formData.frais_concours,
                        numero_compte: e.target.value,
                      },
                    })
                  }
                  placeholder="Ex: 10001234567890"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {concours ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};