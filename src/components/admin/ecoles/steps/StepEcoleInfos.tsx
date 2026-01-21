/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type EcoleFormData } from "@/types/ecole";

type Props = {
  data: EcoleFormData;
  setData: (data: EcoleFormData) => void;
};

export const StepEcoleInfos = ({ data, setData }: Props) => {
  const update = (key: string, value: any) => {
    setData({
      ...data,
      ecole: {
        ...data.ecole,
        [key]: value,
      },
    });
  };

  return (
    <div className="min-w-full space-y-4 p-1">
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Nom de l'école"
          value={data.ecole.libelle_ecole}
          onChange={(e) => update("libelle_ecole", e.target.value)}
        />
        <Input
          placeholder="Code"
          value={data.ecole.code_ecole}
          onChange={(e) => update("code_ecole", e.target.value)}
        />
        <Input
          placeholder="Localisation"
          value={data.ecole.localisation}
          onChange={(e) => update("localisation", e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={data.ecole.email_ecole}
          onChange={(e) => update("email_ecole", e.target.value)}
        />
        <Input
          placeholder="Boite Postale"
          value={data.ecole.bp_ecole}
          onChange={(e) => update("bp_ecole", e.target.value)}
        />
        <Input
          placeholder="Site Web"
          value={data.ecole.siteweb_ecole}
          onChange={(e) => update("siteweb_ecole", e.target.value)}
        />
        <Input
          placeholder="697932976"
          type=""
          value={data.ecole.telephone_ecole}
          onChange={(e) => update("telephone_ecole", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <Label>Logo</Label>
          <Input type="file" onChange={(e) => update("logo", e.target.files?.[0])} />
        </div>
        <div>
          <Label>Bannière</Label>
          <Input type="file" onChange={(e) => update("banniere", e.target.files?.[0])} />
        </div>
        <div>
          <Label>Emblème</Label>
          <Input type="file" onChange={(e) => update("embleme_ecole", e.target.files?.[0])} />
        </div>
      </div>
    </div>
  );
};
