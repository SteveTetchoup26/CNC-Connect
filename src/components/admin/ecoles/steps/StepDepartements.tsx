/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type EcoleFormData, type Departement } from "@/types/ecole";
import { Trash2 } from "lucide-react";

type Props = {
  data: EcoleFormData;
  setData: (data: EcoleFormData) => void;
};

export const StepDepartements = ({ data, setData }: Props) => {
  const addDepartement = () => {
    setData({
      ...data,
      departements: [
        ...data.departements,
        {
          libelle_departement: "",
          code_departement: "",
          description_departement: "",
          filieres: [],
        },
      ],
    });
  };

  const updateDepartement = (index: number, field: keyof Departement, value: string) => {
    const updatedDeps = [...data.departements];
    updatedDeps[index] = {
      ...updatedDeps[index],
      [field]: value,
    };
    setData({
      ...data,
      departements: updatedDeps,
    });
  };

  const removeDepartement = (index: number) => {
    setData({
      ...data,
      departements: data.departements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-w-full space-y-4">
      <Button onClick={addDepartement}>+ Ajouter un département</Button>

      {data.departements.map((dep, i) => (
        <div key={i} className="rounded border p-3 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Département {i + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeDepartement(i)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
          
          <Input
            placeholder="Libellé"
            value={dep.libelle_departement}
            onChange={(e) => updateDepartement(i, "libelle_departement", e.target.value)}
          />
          <Input
            placeholder="Code"
            value={dep.code_departement}
            onChange={(e) => updateDepartement(i, "code_departement", e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={dep.description_departement}
            onChange={(e) => updateDepartement(i, "description_departement", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};