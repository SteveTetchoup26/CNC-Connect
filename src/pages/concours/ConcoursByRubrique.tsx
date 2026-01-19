/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getConcours } from "@/store/concours/concoursSlice";
import EntranceExamCard from "@/components/EntranceExamCard";

const ConcoursByRubrique = () => {
  const { rubrique } = useParams();
  const dispatch = useAppDispatch();

  const { data, meta, loading } = useAppSelector((s) => s.concours);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (rubrique) {
      dispatch(
        getConcours({
          rubrique,
          page,
          per_page: 9,
        })
      );
    }
  }, [rubrique, page, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 capitalize">
        {rubrique?.replace("-", " ")}
      </h1>

      {loading && <p className="text-center">Chargement...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((c: any) => (
          <EntranceExamCard key={c.id} {...c} />
        ))}
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Précédent
          </button>

          <span className="px-4 py-2">
            Page {meta.current_page} / {meta.last_page}
          </span>

          <button
            disabled={page === meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default ConcoursByRubrique;
