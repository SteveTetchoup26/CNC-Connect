/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { utilisateurService } from "@/services/utilisateurService";
import { candidatureService } from "@/services/candidatureService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  MoreVertical,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Utilisateur } from "@/types/utilisateur";
import type { Candidature } from "@/types/candidature";
import { toast } from "sonner";
import { ValiderCandidatureDialog } from "@/components/admin/candidatures/ValiderCandidatureDialog";
import { RejeterCandidatureDialog } from "@/components/admin/candidatures/RejeterCandidatureDialog";
import { AffecterCentresDialog } from "@/components/admin/candidatures/AffecterCentresDialog";

const UtilisateurDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCandidatures, setLoadingCandidatures] = useState(false);
  const [isCandidatRole, setIsCandidatRole] = useState(false);

  // Modals pour les actions sur candidatures
  const [validerOpen, setValiderOpen] = useState(false);
  const [rejeterOpen, setRejeterOpen] = useState(false);
  const [affecterOpen, setAffecterOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const userData = await utilisateurService.getById(Number(id));
        setUtilisateur(userData);

        // Vérifier si l'utilisateur a le rôle CANDIDAT
        const hasRoleCandidат = userData.roles?.some(
          (role) => role.libelle === "CANDIDAT"
        );
        setIsCandidatRole(hasRoleCandidат || false);

        // Si c'est un candidat, charger ses candidatures
        if (hasRoleCandidат) {
          loadCandidatures();
        }
      } catch (error) {
        toast.error("Erreur lors du chargement de l'utilisateur");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const loadCandidatures = async () => {
    if (!id) return;

    try {
      setLoadingCandidatures(true);
      const data = await candidatureService.getByUserId(Number(id));
      setCandidatures(data);
    } catch (error: any) {
      // Si l'utilisateur n'est pas candidat ou n'a pas de candidatures
      if (error.response?.status === 404) {
        setCandidatures([]);
      } else {
        console.error(error);
      }
    } finally {
      setLoadingCandidatures(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getRoleBadge = (roleName: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      CANDIDAT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      SUPERVISEUR: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };

    const colorClass = colors[roleName] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

    return (
      <Badge variant="outline" className={colorClass}>
        {roleName}
      </Badge>
    );
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      EN_ATTENTE: { variant: "secondary", label: "En attente", icon: Clock },
      APPROUVEE: { variant: "default", label: "Approuvée", icon: CheckCircle },
      REJETEE: { variant: "destructive", label: "Rejetée", icon: XCircle },
      VALIDEE: { variant: "default", label: "Validée", icon: CheckCircle },
    };

    const config = variants[statut] || { variant: "secondary", label: statut, icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleViewCandidature = (candidature: Candidature) => {
    navigate(`/admin/candidatures/${candidature.id}`);
  };

  const handleValider = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setValiderOpen(true);
  };

  const handleRejeter = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setRejeterOpen(true);
  };

  const handleAffecter = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setAffecterOpen(true);
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!utilisateur) {
    return <div className="p-6">Utilisateur introuvable</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            {utilisateur.nom && utilisateur.prenom
              ? `${utilisateur.nom} ${utilisateur.prenom}`
              : utilisateur.nom || utilisateur.prenom || "Sans nom"}
          </h1>
          <p className="text-muted-foreground">{utilisateur.email}</p>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{utilisateur.email}</p>
              </div>
            </div>

            {utilisateur.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{utilisateur.telephone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDate(utilisateur.created_at)}</p>
              </div>
            </div>

            {utilisateur.email_verified_at && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Email vérifié le</p>
                  <p className="font-medium">{formatDate(utilisateur.email_verified_at)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rôles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rôles et permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {utilisateur.roles && utilisateur.roles.length > 0 ? (
              <div className="space-y-3">
                {utilisateur.roles.map((role) => (
                  <div key={role.id} className="flex items-start gap-3">
                    <div className="mt-1">{getRoleBadge(role.libelle)}</div>
                    {role.description && (
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun rôle attribué</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Candidatures (si l'utilisateur est un candidat) */}
      {isCandidatRole && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Candidatures
            </CardTitle>
            <CardDescription>
              {candidatures.length} candidature(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCandidatures ? (
              <div className="py-10 text-center">Chargement des candidatures...</div>
            ) : candidatures.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                Aucune candidature trouvée pour cet utilisateur
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concours</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidatures.map((candidature) => (
                        <TableRow key={candidature.id}>
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

                          <TableCell>{formatDateShort(candidature.date_candidature)}</TableCell>

                          <TableCell>{getStatutBadge(candidature.historiques?.[0]?.etat?.libelle_etat || candidature.statut)}</TableCell>

                          <TableCell>
                            <span className="font-mono text-sm">
                              {candidature.code_candidat_def || candidature.code_candidat_temp || "—"}
                            </span>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewCandidature(candidature)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {candidature.statut === "EN_ATTENTE" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleValider(candidature)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRejeter(candidature)}
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAffecter(candidature)}
                              >
                                <MapPin className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {candidatures.map((candidature) => (
                    <Card key={candidature.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base">
                              {candidature.concours?.libelle_concours}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {candidature.concours?.concours_filieres?.[0]?.filiere?.departement?.ecole?.libelle_ecole}
                            </CardDescription>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewCandidature(candidature)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                              {candidature.statut === "EN_ATTENTE" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleValider(candidature)}>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Valider
                                  </DropdownMenuItem>
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{formatDateShort(candidature.date_candidature)}</span>
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
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs pour les actions sur candidatures */}
      {selectedCandidature && (
        <>
          <ValiderCandidatureDialog
            open={validerOpen}
            onOpenChange={setValiderOpen}
            candidature={selectedCandidature}
            onSuccess={loadCandidatures}
          />

          <RejeterCandidatureDialog
            open={rejeterOpen}
            onOpenChange={setRejeterOpen}
            candidature={selectedCandidature}
            onSuccess={loadCandidatures}
          />

          <AffecterCentresDialog
            open={affecterOpen}
            onOpenChange={setAffecterOpen}
            candidature={selectedCandidature}
            onSuccess={loadCandidatures}
          />
        </>
      )}
    </div>
  );
};

export default UtilisateurDetails;