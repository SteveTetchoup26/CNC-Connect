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
import { Plus, Pencil, Trash, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  centreService,
  regionService,
  type Centre,
  type Region,
} from "@/services/centreService";
import CentreFormDialog from "@/components/admin/centres/CentreFormDialog";
import DeleteCentreDialog from "@/components/admin/centres/DeleteCentreDialog";
import { formatCentreType } from "@/utils/formatters";

const Centres = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState<Centre | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [centresData, regionsData] = await Promise.all([
      centreService.getAll(),
      regionService.getAll(),
    ]);
    setCentres(centresData);
    setRegions(regionsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============================
     FILTER
  ============================ */
  const filteredCentres = centres.filter((c) => {
    if (typeFilter !== "ALL" && c.type_centre !== typeFilter) return false;
    if (regionFilter !== "ALL" && c.region_id !== Number(regionFilter))
      return false;
    return true;
  });

  const handleEdit = (centre: Centre) => {
    setSelectedCentre(centre);
    setFormOpen(true);
  };

  const handleDelete = (centre: Centre) => {
    setDeleteId(centre.id);
    setDeleteOpen(true);
  };

  /* ============================
     SKELETON ROWS
  ============================ */
  const skeletonRows = Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-3/4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-2/3" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
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
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Centres</h1>
        <Button
          onClick={() => {
            setSelectedCentre(null);
            setFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un centre
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Type de centre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            <SelectItem value="CENTRE_DE_DEPÔT">Centre de dépôt</SelectItem>
            <SelectItem value="CENTRE_EXAMEN">Centre d'examen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les régions</SelectItem>
            {regions.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                {r.label_region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table - Desktop */}
      <div className="hidden lg:block rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Centre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              skeletonRows
            ) : filteredCentres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Aucun centre trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredCentres.map((centre) => (
                <TableRow key={centre.id}>
                  <TableCell className="font-medium">
                    {centre.libelle_centre}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        centre.type_centre === "CENTRE_EXAMEN"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {formatCentreType(centre.type_centre)}
                    </Badge>
                  </TableCell>

                  <TableCell>{centre.ville_centre}</TableCell>
                  <TableCell>{centre.region?.label_region}</TableCell>
                  <TableCell>{centre.capacite}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(centre)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(centre)}
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

      {/* Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          skeletonCards
        ) : filteredCentres.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              Aucun centre trouvé
            </CardContent>
          </Card>
        ) : (
          filteredCentres.map((centre) => (
            <Card key={centre.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {centre.libelle_centre}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge
                        variant={
                          centre.type_centre === "CENTRE_EXAMEN"
                            ? "secondary"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {formatCentreType(centre.type_centre)}
                      </Badge>
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(centre)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(centre)}
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
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ville:</span>
                    <p className="font-medium">{centre.ville_centre}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Région:</span>
                    <p className="font-medium">{centre.region?.label_region}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacité:</span>
                    <p className="font-medium">{centre.capacite}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CentreFormDialog
        open={formOpen}
        centre={selectedCentre}
        onClose={() => setFormOpen(false)}
        onSuccess={loadData}
      />

      <DeleteCentreDialog
        open={deleteOpen}
        centreId={deleteId}
        onClose={() => setDeleteOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Centres;