import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getConcours } from "@/store/concours/concoursSlice";
import EntranceExamCard from "@/components/EntranceExamCard";

const ConcoursList = () => {
  const dispatch = useAppDispatch();
  const { data, meta, loading } = useAppSelector((s) => s.concours);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getConcours({ page, search, per_page: 6 }));
  }, [page, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Concours disponibles</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un concours..."
          className="border rounded-lg px-4 py-2 w-full md:w-72 outline-secondary"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-center">Chargement...</p>}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((c) => (
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

export default ConcoursList;
