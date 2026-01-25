import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SchoolInfo = () => {
  const { register, control } = useFormContext();

  const niveauxScolaires = [
    "Terminale",
    "Baccalauréat",
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2",
    "Doctorat"
  ];

  const filieres = [
    "Sciences",
    "Lettres",
    "Droit",
    "Économie",
    "Médecine",
    "Ingénierie",
    "Informatique",
    "Commerce",
    "Arts"
  ];

  const diplomes = [
    "Baccalauréat",
    "Licence",
    "Master",
    "Doctorat",
    "Diplôme d'État",
    "Diplôme d'Ingénieur",
    "Doctorat en Médecine"
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="niveau_scolaire">Niveau scolaire<span className="text-secondary">*</span></Label>
          <Controller
            name="niveau_scolaire"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="niveau_scolaire">
                  <SelectValue placeholder="Sélectionnez votre niveau" />
                </SelectTrigger>
                <SelectContent>
                  {niveauxScolaires.map((niveau) => (
                    <SelectItem key={niveau} value={niveau}>
                      {niveau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filiere_origine">Filière d'origine<span className="text-secondary">*</span></Label>
          <Controller
            name="filiere_origine"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="filiere_origine">
                  <SelectValue placeholder="Sélectionnez votre filière" />
                </SelectTrigger>
                <SelectContent>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere} value={filiere}>
                      {filiere}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="diplome_admission">Diplôme d'admission<span className="text-secondary">*</span></Label>
          <Controller
            name="diplome_admission"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="diplome_admission">
                  <SelectValue placeholder="Sélectionnez votre diplôme" />
                </SelectTrigger>
                <SelectContent>
                  {diplomes.map((diplome) => (
                    <SelectItem key={diplome} value={diplome}>
                      {diplome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mention">Mention<span className="text-secondary">*</span></Label>
          <Controller
            name="mention"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="mention">
                  <SelectValue placeholder="Sélectionnez votre mention" />
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
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="annee_diplome">Année du diplôme <span className="text-secondary">*</span></Label>
          <Input
            type="number"
            {...register("annee_diplome")}
            id="annee_diplome"
            placeholder="Ex: 2023"
            min="1900"
            max="2100"
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolInfo;