/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import localites from "@/data/cameroun-localites.json";

const PersonalInfo = () => {
  const { register, control, setValue } = useFormContext();
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedDepartement, setSelectedDepartement] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom<span className="text-secondary">*</span></Label>
          <Input {...register("nom")} id="nom" placeholder="Votre nom" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom<span className="text-secondary">*</span></Label>
          <Input {...register("prenom")} id="prenom" placeholder="Votre prénom" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse<span className="text-secondary">*</span></Label>
          <Input {...register("adresse")} id="adresse" placeholder="Votre adresse complète" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nationalite">Nationalité<span className="text-secondary">*</span></Label>
          <Input {...register("nationalite")} id="nationalite" placeholder="Votre nationalité" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexe">Sexe<span className="text-secondary">*</span></Label>
          <Controller
            name="sexe"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="sexe">
                  <SelectValue placeholder="Sélectionnez votre sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_naissance">Date de naissance<span className="text-secondary">*</span></Label>
          <Input 
            type="date" 
            {...register("date_naissance")} 
            id="date_naissance" 
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="lieu_naissance">Lieu de naissance<span className="text-secondary">*</span></Label>
          <Input 
            {...register("lieu_naissance")} 
            id="lieu_naissance" 
            placeholder="Ville de naissance" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region_origine">Région d'origine<span className="text-secondary">*</span></Label>
          <Controller
            name="region_origine"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const region = localites.regions.find((r) => r.nom === value);
                  setSelectedRegion(region);
                  setSelectedDepartement(null);
                  setValue("departement_origine", "");
                  setValue("ville_origine", "");
                }}
                value={field.value}
              >
                <SelectTrigger id="region_origine">
                  <SelectValue placeholder="Sélectionnez votre région" />
                </SelectTrigger>
                <SelectContent>
                  {localites.regions.map((region) => (
                    <SelectItem key={region.id} value={region.nom}>
                      {region.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departement_origine">Département d'origine<span className="text-secondary">*</span></Label>
          <Controller
            name="departement_origine"
            control={control}
            render={({ field }) => (
              <Select
                disabled={!selectedRegion}
                onValueChange={(value) => {
                  field.onChange(value);
                  const dept = selectedRegion.departements.find(
                    (d: any) => d.nom === value
                  );
                  setSelectedDepartement(dept);
                  setValue("ville_origine", "");
                }}
                value={field.value}
              >
                <SelectTrigger id="departement_origine">
                  <SelectValue placeholder="Sélectionnez votre département" />
                </SelectTrigger>
                <SelectContent>
                  {selectedRegion?.departements.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.nom}>
                      {dept.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ville_origine">Ville d'origine<span className="text-secondary">*</span></Label>
          <Controller
            name="ville_origine"
            control={control}
            render={({ field }) => (
              <Select
                disabled={!selectedDepartement}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="ville_origine">
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartement?.villes.map((ville: string) => (
                    <SelectItem key={ville} value={ville}>
                      {ville}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="statut_matrimonial">Statut matrimonial<span className="text-secondary">*</span></Label>
          <Controller
            name="statut_matrimonial"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="statut_matrimonial">
                  <SelectValue placeholder="Sélectionnez votre statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Célibataire">Célibataire</SelectItem>
                  <SelectItem value="Marié">Marié</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="handicap">Handicap (si applicable)</Label>
          <Input 
            {...register("handicap")} 
            id="handicap" 
            placeholder="Précisez si nécessaire" 
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="photo">Photo d'identité récente<span className="text-secondary">*</span></Label>
          <Input
            type="file"
            accept="image/*"
            {...register("photo")}
            id="photo"
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Format: JPG, PNG. Taille max: 2MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;