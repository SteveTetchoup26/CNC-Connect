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
import { Plus, Pencil, Trash, Eye, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ecoleService } from "@/services/ecoleService";
import { useNavigate } from "react-router-dom";
import { EcoleModal } from "@/components/admin/ecoles/EcoleModal";
import type { Ecole } from "@/types/ecole";
import { DeleteEcoleDialog } from "@/components/admin/ecoles/DeleteEcoleDialog";
import { Skeleton } from "@/components/ui/skeleton";

const Ecoles = () => {
  const navigate = useNavigate();

  const [ecoles, setEcoles] = useState<Ecole[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     FILTER
  ============================ */
  const [localisationFilter, setLocalisationFilter] = useState<string>("ALL");

  /* ============================
     MODALS
  ============================ */
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEcole, setSelectedEcole] = useState<Ecole | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ============================
     LOAD DATA
  ============================ */
  const loadData = async () => {
    setLoading(true);
    const data = await ecoleService.getAll();
    setEcoles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============================
     FILTERED DATA
  ============================ */
  const localisations = Array.from(
    new Set(ecoles.map((e) => e.localisation))
  );

  const filteredEcoles = ecoles.filter((e) => {
    if (localisationFilter !== "ALL" && e.localisation !== localisationFilter)
      return false;
    return true;
  });

  /* ============================
     ACTION HANDLERS
  ============================ */
  const handleView = (ecole: Ecole) => {
    navigate(`/admin/ecoles/${ecole.id}`);
  };

  const handleEdit = (ecole: Ecole) => {
    setSelectedEcole(ecole);
    setFormOpen(true);
  };

  const handleDelete = (ecole: Ecole) => {
    setDeleteId(ecole.id);
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
        <Skeleton className="h-4 w-3/4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-2/3" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-5/6" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
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
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center">
          <Skeleton className="h-4 w-24 mr-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-24 mr-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <div className="space-y-6">
      {/* ============================
         HEADER
      ============================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Écoles</h1>
        <Button
          onClick={() => {
            setSelectedEcole(null);
            setFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une école
        </Button>
      </div>

      {/* ============================
         FILTERS
      ============================ */}
      <div className="flex gap-4">
        <Select
          value={localisationFilter}
          onValueChange={setLocalisationFilter}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les localisations</SelectItem>
            {localisations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ============================
         TABLE - DESKTOP
      ============================ */}
      <div className="hidden md:block rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>École</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              skeletonRows
            ) : filteredEcoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Aucune école trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredEcoles.map((ecole) => (
                <TableRow key={ecole.id}>
                  <TableCell className="font-medium">
                    {ecole.libelle_ecole}
                  </TableCell>

                  <TableCell>{ecole.code_ecole}</TableCell>
                  <TableCell>{ecole.localisation}</TableCell>
                  <TableCell>{ecole.email_ecole}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* VOIR */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(ecole)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* EDIT */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(ecole)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* DELETE */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ecole)}
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
         CARDS - MOBILE
      ============================ */}
      <div className="md:hidden space-y-4">
        {loading ? (
          skeletonCards
        ) : filteredEcoles.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              Aucune école trouvée
            </CardContent>
          </Card>
        ) : (
          filteredEcoles.map((ecole) => (
            <Card key={ecole.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {ecole.libelle_ecole}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {ecole.code_ecole}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(ecole)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(ecole)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(ecole)}
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
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground w-24">Localisation:</span>
                  <span className="font-medium">{ecole.localisation}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground w-24">Email:</span>
                  <span className="font-medium text-xs break-all">
                    {ecole.email_ecole}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ============================
         MODALS
      ============================ */}
      <EcoleModal
        open={formOpen}
        onOpenChange={setFormOpen}
        ecole={selectedEcole}
        onClose={() => setFormOpen(false)}
        onSuccess={loadData}
      />

      <DeleteEcoleDialog
        open={deleteOpen}
        ecoleId={deleteId}
        onClose={() => setDeleteOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Ecoles;