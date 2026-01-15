import { useFormContext } from "react-hook-form";
import { useCentres } from "@/hooks/useCentres";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CentersInfo = () => {
  const { setValue, watch } = useFormContext();
  const { centresDepot, centresExamen, loading } = useCentres();

  const centreDepot = watch("centre_depot_id");
  const centreExamen = watch("centre_examen_id");

  if (loading) {
    return <p className="text-center text-gray-500">Chargement des centres...</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Centre de dépôt */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Centre de dépôt
        </label>

        <Select
          value={centreDepot}
          onValueChange={(value) => setValue("centre_depot_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un centre de dépôt" />
          </SelectTrigger>
          <SelectContent>
            {centresDepot.map((centre) => (
              <SelectItem key={centre.id} value={String(centre.id)}>
                {centre.libelle_centre} — {centre.ville_centre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Centre d'examen */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Centre d'examen
        </label>

        <Select
          value={centreExamen}
          onValueChange={(value) => setValue("centre_examen_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un centre d'examen" />
          </SelectTrigger>
          <SelectContent>
            {centresExamen.map((centre) => (
              <SelectItem key={centre.id} value={String(centre.id)}>
                {centre.libelle_centre} — {centre.ville_centre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CentersInfo;
