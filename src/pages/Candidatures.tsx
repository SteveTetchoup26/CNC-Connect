/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/MesCandidatures.tsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getCandidatures, telechargerFiche } from "@/store/candidature/candidatureSlice";
import CandidatureCard from "@/components/candidatures/CandidatureCard";
import RappelDialog from "@/components/candidatures/RappelDialog";
import CandidatureCardSkeleton from "@/components/skeletons/CandidatureCardSkeleton";
import { useAppDispatch } from "@/store/hooks";

interface Candidature {
  id: number;
  statut: string;
  date_candidature: string;
  concours: {
    libelle_concours: string;
    date_examen: string;
    concours_filieres: Array<{
      filiere: {
        departement: {
          ecole: {
            libelle_ecole: string;
          };
        };
      };
    }>;
  };
  centre_examen: {
    libelle_centre: string;
    ville_centre: string;
  };
  historiques: Array<{
    etat: {
      libelle_etat: string;
    }
  }>
}

const Candidatures = () => {
  const dispatch = useAppDispatch();
  const { data: candidatures, loading } = useSelector(
    (state: RootState) => state.candidatures
  );
  
  const [filteredCandidatures, setFilteredCandidatures] = useState<Candidature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  // Filtres et tri
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [selectedEcole, setSelectedEcole] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modal rappel
  const [showRappelModal, setShowRappelModal] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);

  useEffect(() => {
    dispatch(getCandidatures());
  }, [dispatch]);

  const applyFiltersAndSort = () => {
    let filtered = [...candidatures];

    // Filtre par statut
    if (selectedStatut !== "all") {
      filtered = filtered.filter(c => c.historiques[0].etat.libelle_etat === selectedStatut);
    }

    // Filtre par école
    if (selectedEcole !== "all") {
      filtered = filtered.filter(c => 
        c.concours.concours_filieres[0]?.filiere?.departement?.ecole?.libelle_ecole === selectedEcole
      );
    }

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.concours.libelle_concours.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.concours.concours_filieres[0]?.filiere?.departement?.ecole?.libelle_ecole.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date_candidature).getTime() - new Date(a.date_candidature).getTime();
      } else if (sortBy === "ancien") {
        return new Date(a.date_candidature).getTime() - new Date(b.date_candidature).getTime();
      } else if (sortBy === "nom") {
        return a.concours.libelle_concours.localeCompare(b.concours.libelle_concours);
      }
      return 0;
    });

    setFilteredCandidatures(filtered as Candidature[]);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  const paginatedCandidatures = filteredCandidatures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDefinirRappel = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setShowRappelModal(true);
  };

  const handleVoirDetails = (candidature: Candidature) => {
    console.log("Voir détails de la candidature:", candidature.id);
  };

  const handleTelechargerFiche = async (candidatureId: number) => {
    try {
      await dispatch(telechargerFiche(candidatureId)).unwrap();
      // window.open(result.download_url, '_blank');
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleTelechargerRecu = async (candidatureId: number) => {
    try {
      await dispatch(telechargerFiche(candidatureId)).unwrap();
      // window.open(result.download_url, '_blank');
    } catch (error: any) {
      toast.error("Erreur", {
        description: error || "Impossible de télécharger le reçu"
      });
    }
  };

  const ecoles = Array.from(
    new Set(
      candidatures.map(c => 
        c.concours.concours_filieres[0]?.filiere?.departement?.ecole?.libelle_ecole
      ).filter(Boolean)
    )
  );

  const resetFilters = () => {
    setSelectedStatut("all");
    setSelectedEcole("all");
    setSortBy("recent");
    setSearchTerm("");
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [candidatures, selectedStatut, selectedEcole, sortBy, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header avec skeleton */}
      <div className="mb-8">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mes candidatures
            </h1>
            <p className="text-gray-600">
              Gérez et suivez toutes vos candidatures aux concours
            </p>
          </>
        )}
      </div>

      {/* Filtres et recherche avec skeletons */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {loading ? (
            // Skeletons pour les filtres
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Skeleton className="md:col-span-2 h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <div className="flex items-center justify-between mt-4 md:col-span-5">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Recherche */}
                <div className="md:col-span-2">
                  <Input
                    placeholder="Rechercher un concours ou une école..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Filtre statut */}
                <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="APPROUVEE">Approuvée</SelectItem>
                    <SelectItem value="REJETEE">Rejetée</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtre école */}
                <Select value={selectedEcole} onValueChange={setSelectedEcole}>
                  <SelectTrigger>
                    <SelectValue placeholder="École" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les écoles</SelectItem>
                    {ecoles.map((ecole) => (
                      <SelectItem key={ecole} value={ecole || ""}>
                        {ecole}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récent</SelectItem>
                    <SelectItem value="ancien">Plus ancien</SelectItem>
                    <SelectItem value="nom">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tri et reset */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  {filteredCandidatures.length} candidature{filteredCandidatures.length > 1 ? 's' : ''}
                </div>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {loading ? (
        <Skeleton className="h-6 w-48 mb-4" />
      ) : (
        <div className="mb-4 text-sm text-gray-600">
          {filteredCandidatures.length} candidature{filteredCandidatures.length > 1 ? 's' : ''} trouvée{filteredCandidatures.length > 1 ? 's' : ''}
        </div>
      )}

      {/* Liste des candidatures avec skeletons */}
      {loading ? (
        // Skeletons pour les cartes de candidatures
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <CandidatureCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : paginatedCandidatures.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Aucune candidature trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedCandidatures.map((candidature) => (
            <CandidatureCard
              key={candidature.id}
              candidature={candidature}
              onDefinirRappel={handleDefinirRappel}
              onVoirDetails={handleVoirDetails}
              onTelechargerFiche={handleTelechargerFiche}
              onTelechargerRecu={handleTelechargerRecu}
            />
          ))}
        </div>
      )}

      {/* Pagination avec skeletons */}
      {loading ? (
        // Skeleton pour la pagination
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      ) : totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Dialog Rappel */}
      <RappelDialog
        open={showRappelModal}
        onOpenChange={setShowRappelModal}
        candidature={selectedCandidature}
        onSuccess={() => dispatch(getCandidatures())}
      />
    </div>
  );
};

export default Candidatures;