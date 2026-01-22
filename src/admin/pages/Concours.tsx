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
import { Plus, Pencil, Trash, Eye, FileText, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { concoursService } from "@/services/concoursService";
import type { Concours } from "@/types/concours";
import { ConcoursModal } from "@/components/admin/concours/ConcoursModal";
import { SpecificationModal } from "@/components/admin/concours/SpecificationModal";
import { DeleteConcoursDialog } from "@/components/admin/concours/DeleteConcoursDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ConcoursPage = () => {
  const navigate = useNavigate();

  const [concours, setConcours] = useState<Concours[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     MODALS
  ============================ */
  const [formOpen, setFormOpen] = useState(false);
  const [selectedConcours, setSelectedConcours] = useState<Concours | null>(null);

  const [specOpen, setSpecOpen] = useState(false);
  const [specConcoursId, setSpecConcoursId] = useState<number | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ============================
     LOAD DATA
  ============================ */
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await concoursService.getAll({ raw: true });
      setConcours(response);
    } catch (error) {
      toast.error("Erreur lors du chargement des concours");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============================
     ACTIONS
  ============================ */
  const handleView = (concours: Concours) => {
    navigate(`/admin/concours/${concours.id}`);
  };

  const handleEdit = (concours: Concours) => {
    setSelectedConcours(concours);
    setFormOpen(true);
  };

  const handleDelete = (concours: Concours) => {
    setDeleteId(concours.id);
    setDeleteOpen(true);
  };

  const handleSpecification = (concours: Concours) => {
    setSpecConcoursId(concours.id);
    setSpecOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================
         HEADER
      ============================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Concours</h1>
        <Button
          onClick={() => {
            setSelectedConcours(null);
            setFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un concours
        </Button>
      </div>

      {/* ============================
         TABLE - DESKTOP
      ============================ */}
      <div className="hidden lg:block rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concours</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead>Date examen</TableHead>
              <TableHead>Frais</TableHead>
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
            ) : concours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Aucun concours trouvé
                </TableCell>
              </TableRow>
            ) : (
              concours.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.libelle_concours}
                  </TableCell>

                  <TableCell>
                    {item.sessions?.[0]?.libelle_session || "—"}
                  </TableCell>

                  <TableCell>{formatDate(item.date_limite)}</TableCell>
                  <TableCell>{formatDate(item.date_examen)}</TableCell>

                  <TableCell>
                    {item.frais_concours ? (
                      <span className="font-medium">
                        {item.frais_concours.montant_frais.toLocaleString()} FCFA
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* VOIR */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* SPECIFICATION */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSpecification(item)}
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                      </Button>

                      {/* EDIT */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* DELETE */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
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
          <Card>
            <CardContent className="py-10 text-center">
              Chargement...
            </CardContent>
          </Card>
        ) : concours.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              Aucun concours trouvé
            </CardContent>
          </Card>
        ) : (
          concours.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">
                      {item.libelle_concours}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {item.sessions?.[0]?.libelle_session || "—"}
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSpecification(item)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Spécifications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(item)}
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
                    <span className="text-muted-foreground">Date limite:</span>
                    <p className="font-medium">{formatDate(item.date_limite)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date examen:</span>
                    <p className="font-medium">{formatDate(item.date_examen)}</p>
                  </div>
                </div>
                {item.frais_concours && (
                  <div>
                    <span className="text-muted-foreground text-sm">Frais:</span>
                    <p className="font-semibold text-primary">
                      {item.frais_concours.montant_frais.toLocaleString()} FCFA
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ============================
         MODALS
      ============================ */}
      <ConcoursModal
        open={formOpen}
        onOpenChange={setFormOpen}
        concours={selectedConcours}
        onClose={() => setFormOpen(false)}
        onSuccess={loadData}
      />

      {specConcoursId && (
        <SpecificationModal
          open={specOpen}
          onOpenChange={setSpecOpen}
          concoursId={specConcoursId}
          onClose={() => setSpecOpen(false)}
          onSuccess={loadData}
        />
      )}

      <DeleteConcoursDialog
        open={deleteOpen}
        concoursId={deleteId}
        onClose={() => setDeleteOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default ConcoursPage;