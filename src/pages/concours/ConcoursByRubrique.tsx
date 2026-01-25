/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getConcours } from "@/store/concours/concoursSlice";
import EntranceExamCard from "@/components/EntranceExamCard";
import { Skeleton } from "@/components/ui/skeleton";
import EntranceExamCardSkeleton from "@/components/skeletons/EntranceExamCardSkeleton";

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
      {/* Skeleton pour le titre */}
      {loading ? (
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <h1 className="text-2xl md:text-3xl font-bold mb-8 capitalize">
          {rubrique?.replace("-", " ")}
          <span className="block text-lg text-muted-foreground font-normal mt-2">
            {meta?.total ? `${meta.total} concours trouvés` : ""}
          </span>
        </h1>
      )}

      {/* Grille avec skeletons ou données */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Afficher 9 skeletons pendant le chargement
          Array.from({ length: 9 }).map((_, index) => (
            <EntranceExamCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : data && "data" in data && Array.isArray(data.data) && data.data.length > 0 ? (
          // Afficher les concours réels
          data.data.map((c: any) => (
            <EntranceExamCard key={c.id} {...c} />
          ))
        ) : (
          // Aucun concours trouvé
          <div className="col-span-full text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucun concours trouvé dans cette rubrique.
            </p>
          </div>
        )}
      </div>

      {/* Pagination avec skeletons */}
      {loading ? (
        // Skeleton pour la pagination
        <div className="flex justify-center gap-3 mt-10">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      ) : meta && data && "data" in data && Array.isArray(data.data) && data.data.length > 0 ? (
        // Pagination réelle
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
          <div className="text-sm text-muted-foreground">
            Affichage de {(page - 1) * 9 + 1} à {Math.min(page * 9, meta.total)} sur {meta.total} concours
          </div>
          
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.last_page) }).map((_, idx) => {
                let pageNum;
                if (meta.last_page <= 5) {
                  pageNum = idx + 1;
                } else if (page <= 3) {
                  pageNum = idx + 1;
                } else if (page >= meta.last_page - 2) {
                  pageNum = meta.last_page - 4 + idx;
                } else {
                  pageNum = page - 2 + idx;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                      page === pageNum
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ConcoursByRubrique;