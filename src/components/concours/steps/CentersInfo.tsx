import { useFormContext } from "react-hook-form";
import { useCentres } from "@/hooks/useCentres";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const CentersInfo = () => {
  const { setValue, watch } = useFormContext();
  const { centresDepot, centresExamen, loading } = useCentres();

  const centreDepot = watch("centre_depot_id");
  const centreExamen = watch("centre_examen_id");

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Centre de dépôt */}
        <div className="space-y-2">
          <Label htmlFor="centre_depot_id">
            Centre de dépôt <span className="text-secondary">*</span>
          </Label>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Select
              value={centreDepot}
              onValueChange={(value) => setValue("centre_depot_id", value)}
            >
              <SelectTrigger id="centre_depot_id">
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
          )}
          <p className="text-xs text-muted-foreground">
            Où déposer votre dossier physique
          </p>
        </div>

        {/* Centre d'examen */}
        <div className="space-y-2">
          <Label htmlFor="centre_examen_id">
            Centre d'examen <span className="text-secondary">*</span>
          </Label>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Select
              value={centreExamen}
              onValueChange={(value) => setValue("centre_examen_id", value)}
            >
              <SelectTrigger id="centre_examen_id">
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
          )}
          <p className="text-xs text-muted-foreground">
            Où passer votre examen
          </p>
        </div>
      </div>
    </div>
  );
};

export default CentersInfo;
