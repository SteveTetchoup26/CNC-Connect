import { useEffect, useState } from "react";
import { centreService } from "@/services/centreService";

export interface Centre {
  id: number;
  libelle_centre: string;
  ville_centre: string;
  capacite: number;
}

export const useCentres = () => {
  const [centresDepot, setCentresDepot] = useState<Centre[]>([]);
  const [centresExamen, setCentresExamen] = useState<Centre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      centreService.getByType("CENTRE_DE_DEPÔT"),
      centreService.getByType("CENTRE_EXAMEN"),
    ])
      .then(([depot, examen]) => {
        setCentresDepot(depot);
        setCentresExamen(examen);
      })
      .finally(() => setLoading(false));
  }, []);

  return { centresDepot, centresExamen, loading };
};
