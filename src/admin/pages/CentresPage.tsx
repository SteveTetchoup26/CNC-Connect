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
import { Plus, Pencil, Trash } from "lucide-react";
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

const CentresPage = () => {
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

//   /* ============================
//      DELETE
//   ============================ */
//   const handleDelete = async (id: number) => {
//     if (!confirm("Supprimer ce centre ?")) return;
//     await centreService.delete(id);
//     loadData();
//   };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Centres</h1>
        <Button
          onClick={() => {
            setSelectedCentre(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un centre
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Type de centre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            <SelectItem value="CENTRE_DE_DEPÔT">Centre de dépôt</SelectItem>
            <SelectItem value="CENTRE_EXAMEN">Centre d'examen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-56">
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

      {/* Table */}
      <div className="rounded-lg border bg-background">
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
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Chargement...
                </TableCell>
              </TableRow>
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

                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCentre(centre);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(centre.id);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

export default CentresPage;
