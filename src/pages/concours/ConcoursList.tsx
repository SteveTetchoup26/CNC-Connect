import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getConcours } from "@/store/concours/concoursSlice";
import { classifyConcours } from "@/utils/classifyConcours";
import { RUBRIQUES } from "@/utils/concoursRubriques";
import ConcoursSlider from "@/components/ConcoursSlider";

const ConcoursList = () => {
  const dispatch = useAppDispatch();
  const { data: concours, loading } = useAppSelector((s) => s.concours);

  useEffect(() => {
    dispatch(getConcours({ raw: true }));
  }, [dispatch]);

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  const sections = classifyConcours(concours);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      {/* <h1 className="text-2xl font-bold">Concours disponibles</h1> */}

      {RUBRIQUES.map((r) => (
        <ConcoursSlider
          key={r.key}
          title={r.title}
          items={sections[r.key] || []}
          rubrique={r.title}
        />
      ))}

      <ConcoursSlider
        title="Autres concours"
        items={sections.others || []}
        rubrique="Autres concours"
      />
    </div>
  );
};

export default ConcoursList;
