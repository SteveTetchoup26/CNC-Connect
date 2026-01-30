import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const PaymentInfo = () => {
  const { register, setValue } = useFormContext();
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const handlePaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPaymentFile(file);
    // Stocker le fichier dans le formulaire
    setValue("fiche_paiement", file, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="num_recu">Numéro de reçu <span className="text-secondary">*</span></Label>
          <Input
            {...register("num_recu")}
            id="num_recu"
            placeholder="Numéro figurant sur votre reçu"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fiche_paiement">Reçu de paiement <span className="text-secondary">*</span></Label>
          <Input
            type="file"
            accept=".pdf,image/*"
            onChange={handlePaymentFileChange}
            id="fiche_paiement"
            name="fiche_paiement"
            className="cursor-pointer"
          />
          {paymentFile && (
            <p className="text-sm text-green-600">
              ✓ Fichier sélectionné: {paymentFile.name}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Formats acceptés: PDF, JPG, PNG. Taille max: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;