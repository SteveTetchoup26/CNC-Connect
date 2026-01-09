import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PersonalInfo = () => {
  const { register, control } = useFormContext();

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
      <Input {...register("region_origine")} placeholder="Région d'origine" />
      <Input {...register("ville_origine")} placeholder="Ville d'origine" />
      <Input {...register("departement_origine")} placeholder="Département d'origine" />

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
    </div>
  );
};

export default PersonalInfo;
