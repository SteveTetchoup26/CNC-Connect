/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Ajoutez cette importation
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Eye, 
  Trash, 
  MoreVertical,  
  XCircle,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { candidatureService } from "@/services/candidatureService";
import { ecoleService } from "@/services/ecoleService";
import type { Candidature } from "@/types/candidature";
import type { Ecole } from "@/types/ecole";
import { ValiderCandidatureDialog } from "@/components/admin/candidatures/ValiderCandidatureDialog";
import { RejeterCandidatureDialog } from "@/components/admin/candidatures/RejeterCandidatureDialog";
import { AffecterCentresDialog } from "@/components/admin/candidatures/AffecterCentresDialog";
import { DeleteCandidatureDialog } from "@/components/admin/candidatures/DeleteCandidatureDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CandidaturesPage = () => {
  const navigate = useNavigate();

  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [ecoles, setEcoles] = useState<Ecole[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     FILTERS
  ============================ */
  const [statutFilter, setStatutFilter] = useState<string>("all");
  const [ecoleFilter, setEcoleFilter] = useState<string>("all");

  /* ============================
     MODALS
  ============================ */
  const [validerOpen, setValiderOpen] = useState(false);
  const [rejeterOpen, setRejeterOpen] = useState(false);
  const [affecterOpen, setAffecterOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);

  /* ============================
     LOAD DATA
  ============================ */
  const loadData = async () => {
    try {
      setLoading(true);
      const [candidaturesData, ecolesData] = await Promise.all([
        candidatureService.getAll(),
        ecoleService.getAll(),
      ]);
      console.log(candidaturesData)
      setCandidatures(candidaturesData);
      setEcoles(ecolesData);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============================
     FILTERED DATA
  ============================ */
  const filteredCandidatures = candidatures.filter((c) => {
    if (statutFilter !== "all" && c.historiques?.[0]?.etat?.libelle_etat !== statutFilter) return false;
    if (ecoleFilter !== "all") {
      const ecoleId = c.concours?.concours_filieres?.[0]?.filiere?.departement?.ecole?.id;
      if (ecoleId !== Number(ecoleFilter)) return false;
    }
    return true;
  });

  /* ============================
     ACTIONS
  ============================ */
  const handleView = (candidature: Candidature) => {
    navigate(`/admin/candidatures/${candidature.id}`);
  };

  // const handleValider = (candidature: Candidature) => {
  //   setSelectedCandidature(candidature);
  //   setValiderOpen(true);
  // };

  const handleRejeter = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setRejeterOpen(true);
  };

  const handleAffecter = (candidature: Candidature) => {
     console.log("handleAffecter appelé", candidature.id); 
    setSelectedCandidature(candidature);
    setAffecterOpen(true);
  };

  const handleDelete = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setDeleteOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      EN_ATTENTE: { variant: "secondary", label: "En attente" },
      APPROUVEE: { variant: "default", label: "Approuvée" },
      REJETEE: { variant: "destructive", label: "Rejetée" },
      VALIDEE: { variant: "default", label: "Validée" },
    };

    const config = variants[statut] || { variant: "secondary", label: statut };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  /* ============================
     SKELETON ROWS
  ============================ */
  const skeletonRows = Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  ));

  /* ============================
     SKELETON CARDS (MOBILE)
  ============================ */
  const skeletonCards = Array.from({ length: 3 }).map((_, index) => (
    <Card key={`skeleton-card-${index}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  ));

  /* ============================
     SKELETON FILTERS
  ============================ */
  const skeletonFilters = (
    <div className="flex flex-col sm:flex-row gap-4">
      <Skeleton className="h-10 w-full sm:w-56" />
      <Skeleton className="h-10 w-full sm:w-56" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ============================
         HEADER
      ============================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Candidatures</h1>
          <p className="text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32 mt-1" />
            ) : (
              `${filteredCandidatures.length} candidature(s)`
            )}
          </p>
        </div>
      </div>

      {/* ============================
         FILTERS
      ============================ */}
      {loading ? skeletonFilters : (
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              <SelectItem value="APPROUVEE">Approuvée</SelectItem>
              <SelectItem value="REJETEE">Rejetée</SelectItem>
              <SelectItem value="VALIDEE">Validée</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ecoleFilter} onValueChange={setEcoleFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="École" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les écoles</SelectItem>
              {ecoles.map((ecole) => (
                <SelectItem key={ecole.id} value={String(ecole.id)}>
                  {ecole.libelle_ecole}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ============================
         TABLE - DESKTOP
      ============================ */}
      <div className="hidden lg:block rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidat</TableHead>
              <TableHead>Concours</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? skeletonRows : filteredCandidatures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Aucune candidature trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidatures.map((candidature) => (
                <TableRow key={candidature.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {candidature.candidat?.utilisateur?.nom}{" "}
                        {candidature.candidat?.utilisateur?.prenom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {candidature.candidat?.utilisateur?.email}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {candidature.concours?.libelle_concours}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {candidature.concours?.concours_filieres?.[0]?.filiere?.departement?.ecole?.libelle_ecole}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{formatDate(candidature.date_candidature)}</TableCell>

                  <TableCell>{getStatutBadge(candidature.historiques?.[0]?.etat?.libelle_etat || candidature.statut)}</TableCell>

                  <TableCell>
                    <span className="font-mono text-sm">
                      {candidature.code_candidat_def || candidature.code_candidat_def || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(candidature)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* {candidature.historiques?.[0]?.etat?.libelle_etat === "EN_ATTENTE" && ( */}
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRejeter(candidature)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      {/* )} */}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAffecter(candidature)}
                      >
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(candidature)}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ============================
         CARDS - MOBILE/TABLET
      ============================ */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          skeletonCards
        ) : filteredCandidatures.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              Aucune candidature trouvée
            </CardContent>
          </Card>
        ) : (
          filteredCandidatures.map((candidature) => (
            <Card key={candidature.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">
                      {candidature.candidat?.utilisateur?.nom}{" "}
                      {candidature.candidat?.utilisateur?.prenom}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {candidature.concours?.libelle_concours}
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(candidature)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      {candidature.historiques?.[0]?.etat?.libelle_etat === "APPROUVEE" && (
                        <>
                         {/* <DropdownMenuItem onClick={() => handleValider(candidature)}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Valider
                          </DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => handleRejeter(candidature)}>
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Rejeter
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleAffecter(candidature)}>
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        Affecter centres
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(candidature)}
                        className="text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatDate(candidature.date_candidature)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Statut:</span>
                  {getStatutBadge(candidature.statut)}
                </div>
                {(candidature.code_candidat_def || candidature.code_candidat_temp) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Code:</span>
                    <span className="font-mono text-xs">
                      {candidature.code_candidat_def || candidature.code_candidat_temp}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ============================
         DIALOGS
      ============================ */}
      {selectedCandidature && (
        <>
          <ValiderCandidatureDialog
            open={validerOpen}
            onOpenChange={setValiderOpen}
            candidature={selectedCandidature}
            onSuccess={loadData}
          />

          <RejeterCandidatureDialog
            open={rejeterOpen}
            onOpenChange={setRejeterOpen}
            candidature={selectedCandidature}
            onSuccess={loadData}
          />

          <AffecterCentresDialog
            open={affecterOpen}
            onOpenChange={setAffecterOpen}
            candidature={selectedCandidature}
            onSuccess={loadData}
          />

          <DeleteCandidatureDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            candidature={selectedCandidature}
            onSuccess={loadData}
          />
        </>
      )}
    </div>
  );
};

export default CandidaturesPage;