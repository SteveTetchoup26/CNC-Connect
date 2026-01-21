/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  sessionService,
  type EtatSession,
  type Session,
} from "@/services/sessionService";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  onSuccess: () => void;
};

export const SessionModal = ({
  open,
  onOpenChange,
  session,
  onSuccess,
}: Props) => {
  const [libelle, setLibelle] = useState("");
  const [description, setDescription] = useState("");
  const [etats, setEtats] = useState<EtatSession[]>([]);
  const [etatId, setEtatId] = useState<number | undefined>();

  const [loading, setLoading] = useState(false);

  /** Dernier état réel */
  const currentEtatId = useMemo(() => {
    if (!session?.historiques?.length) return undefined;

    return session.historiques
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date_etat).getTime() - new Date(a.date_etat).getTime(),
      )[0].etat.id;
  }, [session]);

  useEffect(() => {
    if (session) {
      setLibelle(session.libelle_session);
      setDescription(session.description_session);
      setEtatId(currentEtatId);
    } else {
      setLibelle("");
      setDescription("");
      setEtatId(undefined);
    }
  }, [session, currentEtatId]);

  useEffect(() => {
    if (open && session) {
      sessionService.getEtatSession().then(setEtats);

      const currentEtat = session.historiques
        ?.slice()
        .sort(
          (a, b) =>
            new Date(b.date_etat).getTime() - new Date(a.date_etat).getTime(),
        )[0]?.etat;

      setEtatId(currentEtat?.id);
    }
  }, [open, session]);

  const handleSubmit = async () => {
    if (!libelle.trim() || !description.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      if (session) {
        const payload: any = {
          libelle_session: libelle,
          description_session: description,
          etat_id: etatId,
        };

        // Envoyer l’état seulement s’il a changé
        if (etatId && etatId !== currentEtatId) {
          payload.etat_id = etatId;
        }

        await sessionService.update(session.id, payload);
        toast.success("Session mise à jour avec succès");
      } else {
        await sessionService.create({
          libelle_session: libelle,
          description_session: description,
        });

        toast.success("Session créée avec succès");
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {session ? "Modifier la session" : "Créer une session"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Libellé de la session"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* État (uniquement en édition) */}
          {session && (
            <Select
              value={etatId?.toString()}
              onValueChange={(value) => setEtatId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Etat Session" />
              </SelectTrigger>
              <SelectContent>
                {etats.map((etat) => (
                  <SelectItem key={etat.id} value={etat.id.toString()}>
                    {etat.libelle_etat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {session ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
