import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SchoolInfo = () => {
  const { register, control } = useFormContext();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input {...register("niveau_scolaire")} placeholder="Niveau scolaire" />

      <Input {...register("filiere_origine")} placeholder="Filière d'origine" />

      <Input {...register("diplome_admission")} placeholder="Diplôme d'admission" />

      <Controller
        name="mention"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Mention" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Passable">Passable</SelectItem>
              <SelectItem value="Assez bien">Assez bien</SelectItem>
              <SelectItem value="Bien">Bien</SelectItem>
              <SelectItem value="Très bien">Très bien</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Input
        type="number"
        {...register("annee_diplome")}
        placeholder="Année du diplôme"
      />
    </div>
  );
};

export default SchoolInfo;
