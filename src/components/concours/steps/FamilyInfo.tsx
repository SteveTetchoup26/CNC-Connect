import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FamilyInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nom_mere">Nom de la mère<span className="text-secondary">*</span></Label>
          <Input
            {...register("nom_mere")}
            id="nom_mere"
            placeholder="Nom complet de la mère"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone_mere">Téléphone de la mère<span className="text-secondary">*</span></Label>
          <Input
            {...register("telephone_mere")}
            id="telephone_mere"
            placeholder="Numéro de téléphone"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nom_pere">Nom du père<span className="text-secondary">*</span></Label>
          <Input
            {...register("nom_pere")}
            id="nom_pere"
            placeholder="Nom complet du père"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone_pere">Téléphone du père <span className="text-secondary">*</span></Label>
          <Input
            {...register("telephone_pere")}
            id="telephone_pere"
            placeholder="Numéro de téléphone"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nom_tuteur">Nom du tuteur</Label>
          <Input
            {...register("nom_tuteur")}
            id="nom_tuteur"
            placeholder="Nom complet du tuteur"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone_tuteur">Téléphone du tuteur</Label>
          <Input
            {...register("telephone_tuteur")}
            id="telephone_tuteur"
            placeholder="Numéro de téléphone"
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyInfo;