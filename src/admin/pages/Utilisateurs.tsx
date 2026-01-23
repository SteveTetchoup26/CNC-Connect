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
import { Input } from "@/components/ui/input";
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
  Plus,
  Pencil,
  Trash,
  MoreVertical,
  Search,
  Mail,
  Phone,
  Eye,
} from "lucide-react";
import { utilisateurService, roleService } from "@/services/utilisateurService";
import type { Utilisateur, Role } from "@/types/utilisateur";
import { UtilisateurModal } from "@/components/admin/utilisateurs/UtilisateurModal";
import { DeleteUtilisateurDialog } from "@/components/admin/utilisateurs/DeleteUtilisateurDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const UtilisateursPage = () => {
  const navigate = useNavigate();

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     FILTERS
  ============================ */
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  /* ============================
     MODALS
  ============================ */
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] =
    useState<Utilisateur | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ============================
     LOAD DATA
  ============================ */
  const loadData = async () => {
    try {
      setLoading(true);
      const [utilisateursData, rolesData] = await Promise.all([
        utilisateurService.getAll(),
        roleService.getAll(),
      ]);
      setUtilisateurs(utilisateursData);
      setRoles(rolesData);
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
  const filteredUtilisateurs = utilisateurs.filter((u) => {
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchNom = u.nom?.toLowerCase().includes(query);
      const matchPrenom = u.prenom?.toLowerCase().includes(query);
      const matchEmail = u.email.toLowerCase().includes(query);
      if (!matchNom && !matchPrenom && !matchEmail) return false;
    }

    // Filtre par rôle
    if (roleFilter !== "all") {
      const hasRole = u.roles?.some((r) => r.id === Number(roleFilter));
      if (!hasRole) return false;
    }

    return true;
  });

  /* ============================
     ACTIONS
  ============================ */
  const handleView = (user: Utilisateur) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleEdit = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setFormOpen(true);
  };

  const handleDelete = (utilisateur: Utilisateur) => {
    setDeleteId(utilisateur.id);
    setDeleteOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getRoleBadge = (role: Role) => {
    const colors: Record<string, string> = {
      ADMIN:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      CANDIDAT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      SUPERVISEUR:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };

    const colorClass =
      colors[role.libelle] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

    return (
      <Badge variant="outline" className={colorClass}>
        {role.libelle}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* ============================
         HEADER
      ============================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Utilisateurs</h1>
          <p className="text-muted-foreground">
            {filteredUtilisateurs.length} utilisateur(s)
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedUtilisateur(null);
            setFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* ============================
         FILTERS
      ============================ */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ============================
         TABLE - DESKTOP
      ============================ */}
      <div className="hidden lg:block rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Rôle(s)</TableHead>
              <TableHead>Date création</TableHead>
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
            ) : filteredUtilisateurs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredUtilisateurs.map((utilisateur) => (
                <TableRow key={utilisateur.id}>
                  <TableCell className="font-medium">
                    {utilisateur.nom && utilisateur.prenom
                      ? `${utilisateur.nom} ${utilisateur.prenom}`
                      : utilisateur.nom || utilisateur.prenom || "—"}
                  </TableCell>

                  <TableCell>{utilisateur.email}</TableCell>

                  <TableCell>{utilisateur.telephone || "—"}</TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {utilisateur.roles?.map((role) => (
                        <span key={role.id}>{getRoleBadge(role)}</span>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>{formatDate(utilisateur.created_at)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(utilisateur)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(utilisateur)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(utilisateur)}
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
        ) : filteredUtilisateurs.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              Aucun utilisateur trouvé
            </CardContent>
          </Card>
        ) : (
          filteredUtilisateurs.map((utilisateur) => (
            <Card key={utilisateur.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">
                      {utilisateur.nom && utilisateur.prenom
                        ? `${utilisateur.nom} ${utilisateur.prenom}`
                        : utilisateur.nom || utilisateur.prenom || "Sans nom"}
                    </CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap gap-1">
                      {utilisateur.roles?.map((role) => (
                        <span key={role.id}>{getRoleBadge(role)}</span>
                      ))}
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(utilisateur)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(utilisateur)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(utilisateur)}
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
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="break-all">{utilisateur.email}</span>
                </div>
                {utilisateur.telephone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{utilisateur.telephone}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2">
                  Créé le {formatDate(utilisateur.created_at)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ============================
         MODALS
      ============================ */}
      <UtilisateurModal
        open={formOpen}
        onOpenChange={setFormOpen}
        utilisateur={selectedUtilisateur}
        roles={roles}
        onClose={() => setFormOpen(false)}
        onSuccess={loadData}
      />

      <DeleteUtilisateurDialog
        open={deleteOpen}
        utilisateurId={deleteId}
        onClose={() => setDeleteOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default UtilisateursPage;
