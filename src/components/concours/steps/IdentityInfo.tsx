import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const IdentityInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input
        {...register("numero_cni")}
        placeholder="Numéro CNI"
      />

      <Input
        type="date"
        {...register("date_delivrance_cni")}
        placeholder="Date de délivrance"
      />
      
    </div>
  );
};

export default IdentityInfo;
