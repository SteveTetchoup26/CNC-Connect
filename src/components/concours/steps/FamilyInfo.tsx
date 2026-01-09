import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const FamilyInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input {...register("nom_mere")} placeholder="Nom de la mère" />
      <Input {...register("telephone_mere")} placeholder="Téléphone de la mère" />

      <Input {...register("nom_pere")} placeholder="Nom du père" />
      <Input {...register("telephone_pere")} placeholder="Téléphone du père" />

      <Input {...register("nom_tuteur")} placeholder="Nom du tuteur" />
      <Input {...register("telephone_tuteur")} placeholder="Téléphone du tuteur" />
    </div>
  );
};

export default FamilyInfo;
