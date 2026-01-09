import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const PaymentInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Input {...register("num_recu")} placeholder="Numéro de reçu" />

      <Input
        type="file"
        accept=".pdf,image/*"
        {...register("fiche_paiement")}
      />
    </div>
  );
};

export default PaymentInfo;
