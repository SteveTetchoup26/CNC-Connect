import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getConcours } from "@/store/concours/concoursSlice";
import { classifyConcours } from "@/utils/classifyConcours";
import { RUBRIQUES } from "@/utils/concoursRubriques";
import ConcoursSlider from "@/components/ConcoursSlider";
import { Skeleton } from "@/components/ui/skeleton";

const ConcoursList = () => {
  const dispatch = useAppDispatch();
  const { data: concours, loading } = useAppSelector((s) => s.concours);

  useEffect(() => {
    dispatch(getConcours({ raw: true }));
  }, [dispatch]);

  const sections = classifyConcours(concours);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      {/* Titre principal avec skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          Concours disponibles
          <span className="text-lg font-normal text-muted-foreground block md:inline md:ml-2">
            ({concours.length})
          </span>
        </h1>
      )}

      {/* Affichage des rubriques avec skeletons */}
      {RUBRIQUES.map((r) => (
        <ConcoursSlider
          key={r.key}
          title={r.title}
          items={sections[r.key] || []}
          rubrique={r.title}
          isLoading={loading} // Passe le state de chargement
        />
      ))}

      {/* Section "Autres concours" avec skeleton */}
      <ConcoursSlider
        title="Autres concours"
        items={sections.others || []}
        rubrique="Autres concours"
        isLoading={loading} // Passe le state de chargement
      />
    </div>
  );
};

export default ConcoursList;