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
import localites from "@/data/cameroun-localites.json";

const PersonalInfo = () => {
  const { register, control, setValue } = useFormContext();
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedDepartement, setSelectedDepartement] = useState<any>(null);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Input {...register("nom")} placeholder="Nom" />
      <Input {...register("prenom")} placeholder="Prénom" />
      <Input {...register("adresse")} placeholder="Adresse" />

      <Input {...register("nationalite")} placeholder="Nationalité" />

      <Controller
        name="sexe"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      {/* <Input type="number" {...register("age")} placeholder="Âge" /> */}

      <Input type="date" {...register("date_naissance")} />

      <Input {...register("lieu_naissance")} placeholder="Lieu de naissance" />
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

              // 🔴 RESET AUTOMATIQUE
              setValue("departement_origine", "");
              setValue("ville_origine", "");
            }}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Région d'origine" />
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

              // 🔴 RESET VILLE
              setValue("ville_origine", "");
            }}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Département d'origine" />
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

      <Controller
        name="ville_origine"
        control={control}
        render={({ field }) => (
          <Select
            disabled={!selectedDepartement}
            onValueChange={field.onChange}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ville d'origine" />
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

      <Controller
        name="statut_matrimonial"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Statut matrimonial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Célibataire">Célibataire</SelectItem>
              <SelectItem value="Marié">Marié</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Input {...register("handicap")} placeholder="Handicap (si applicable)" />

      <Input
        type="file"
        accept="image/*"
        {...register("photo")}
        placeholder="Votre photo"
      />
    </div>
  );
};

export default PersonalInfo;
