import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IdentityInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="numero_cni">Numéro CNI <span className="text-secondary">*</span></Label>
          <Input
            {...register("numero_cni")}
            id="numero_cni"
            placeholder="Votre numéro de CNI"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_delivrance_cni">Date de délivrance <span className="text-secondary">*</span></Label>
          <Input
            type="date"
            {...register("date_delivrance_cni")}
            id="date_delivrance_cni"
          />
        </div>
      </div>
    </div>
  );
};

export default IdentityInfo;