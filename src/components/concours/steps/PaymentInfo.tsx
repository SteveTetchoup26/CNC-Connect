import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const PaymentInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Numéro de reçu <span className="text-secondary">*</span>
          </div>
          <Input
            {...register("num_recu")}
            placeholder="Numéro figurant sur votre reçu"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Reçu de paiement <span className="text-secondary">*</span>
          </div>
          <Input
            type="file"
            accept=".pdf,image/*"
            {...register("fiche_paiement")}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Formats acceptés: PDF, JPG, PNG. Taille max: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;