/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { toast } from "sonner";
import { utilisateurService } from "@/services/utilisateurService";
import type { Utilisateur, UtilisateurFormData, Role } from "@/types/utilisateur";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  utilisateur?: Utilisateur | null;
  roles: Role[];
  onSuccess: () => void;
  onClose: () => void;
};

export const UtilisateurModal = ({
  open,
  utilisateur,
  roles,
  onSuccess,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UtilisateurFormData>({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    telephone: "",
    role_id: 0,
  });

  // Charger les données de l'utilisateur en mode édition
  useEffect(() => {
    if (utilisateur && open) {
      setFormData({
        email: utilisateur.email,
        password: "", // Ne pas pré-remplir le mot de passe
        nom: utilisateur.nom || "",
        prenom: utilisateur.prenom || "",
        telephone: utilisateur.telephone || "",
        role_id: utilisateur.roles?.[0]?.id || 0,
      });
    } else {
      setFormData({
        email: "",
        password: "",
        nom: "",
        prenom: "",
        telephone: "",
        role_id: 0,
      });
    }
  }, [utilisateur, open]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.email) {
      toast.error("L'email est obligatoire");
      return;
    }

    if (!utilisateur && !formData.password) {
      toast.error("Le mot de passe est obligatoire pour un nouvel utilisateur");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (!formData.role_id) {
      toast.error("Veuillez sélectionner un rôle");
      return;
    }

    try {
      setLoading(true);

      // Préparer les données (ne pas envoyer le password s'il est vide en mode édition)
      const payload: any = {
        email: formData.email,
        nom: formData.nom || undefined,
        prenom: formData.prenom || undefined,
        telephone: formData.telephone || undefined,
        role_id: formData.role_id,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (utilisateur?.id) {
        await utilisateurService.update(utilisateur.id, payload);
        toast.success("Utilisateur mis à jour avec succès");
      } else {
        await utilisateurService.create(payload);
        toast.success("Utilisateur créé avec succès");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
      toast.error(message);
      
      // Afficher les erreurs de validation
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msgs: any) => {
          msgs.forEach((msg: string) => toast.error(msg));
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {utilisateur ? "Modifier l'utilisateur" : "Créer un utilisateur"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemple@email.com"
              className="mt-2"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <Label htmlFor="password">
              Mot de passe {utilisateur ? "(laisser vide pour ne pas modifier)" : "*"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={utilisateur ? "Nouveau mot de passe" : "Minimum 6 caractères"}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 6 caractères
            </p>
          </div>

          {/* Nom */}
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Nom de famille"
              className="mt-2"
            />
          </div>

          {/* Prénom */}
          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              placeholder="Prénom"
              className="mt-2"
            />
          </div>

          {/* Téléphone */}
          <div>
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              placeholder="+237 6XX XX XX XX"
              className="mt-2"
            />
          </div>

          {/* Rôle */}
          <div>
            <Label htmlFor="role">Rôle *</Label>
            <Select
              value={String(formData.role_id)}
              onValueChange={(value) =>
                setFormData({ ...formData, role_id: Number(value) })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.libelle}
                    {role.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        - {role.description}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {utilisateur ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};