/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidatureService } from "@/services/candidatureService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Ajoutez cette importation
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  GraduationCap,
  FileText,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Home,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import { et, fr } from "date-fns/locale";
import type { Candidature } from "@/types/candidature";
import { toast } from "sonner";
import { ValiderCandidatureDialog } from "@/components/admin/candidatures/ValiderCandidatureDialog";
import { RejeterCandidatureDialog } from "@/components/admin/candidatures/RejeterCandidatureDialog";
import { AffecterCentresDialog } from "@/components/admin/candidatures/AffecterCentresDialog";

const CandidatureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidature, setCandidature] = useState<Candidature | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [validerOpen, setValiderOpen] = useState(false);
  const [rejeterOpen, setRejeterOpen] = useState(false);
  const [affecterOpen, setAffecterOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await candidatureService.getById(Number(id));
        setCandidature(data);
      } catch (error) {
        toast.error("Erreur lors du chargement de la candidature");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      EN_ATTENTE: {
        variant: "secondary",
        label: "En attente",
        icon: Clock,
      },
      APPROUVEE: {
        variant: "default",
        label: "Approuvée",
        icon: CheckCircle,
      },
      REJETEE: {
        variant: "destructive",
        label: "Rejetée",
        icon: XCircle,
      },
      VALIDEE: {
        variant: "default",
        label: "Validée",
        icon: CheckCircle,
      },
    };

    const config = variants[statut] || {
      variant: "secondary",
      label: statut,
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const reloadData = async () => {
    if (!id) return;
    try {
      const data = await candidatureService.getById(Number(id));
      setCandidature(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ============================
     SKELETONS
  ============================ */
  const skeletonHeader = (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Statut et Code skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informations personnelles skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations familiales skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations scolaires skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Concours et Centres skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                {index === 1 && <Skeleton className="h-8 w-24" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, subIndex) => (
                <div key={subIndex} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historique skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b">
                <Skeleton className="h-2 w-2 rounded-full mt-2" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return <div className="p-6">{skeletonHeader}</div>;
  }

  if (!candidature) {
    return <div className="p-6">Candidature introuvable</div>;
  }

  const candidat = candidature.candidat;
  const utilisateur = candidat?.utilisateur;
  const concours = candidature.concours;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {utilisateur?.nom} {utilisateur?.prenom}
            </h1>
            <p className="text-muted-foreground">{concours?.libelle_concours}</p>
          </div>
        </div>

        {candidature.statut === "APPROUVEE" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setRejeterOpen(true)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
            {/* <Button onClick={() => setValiderOpen(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider
            </Button> */}
          </div>
        )}
      </div>

      {/* Statut et Code */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Statut
            </CardTitle>
          </CardHeader>
          <CardContent>{getStatutBadge(candidature.historiques?.[0]?.etat?.libelle_etat || candidature.statut)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Code candidat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">
              {candidature.code_candidat_def ||
                candidature.code_candidat_temp ||
                "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Date de candidature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{formatDate(candidature.date_candidature)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Motif de rejet si applicable */}
      {candidature.statut === "REJETEE" && candidature.motif_rejet && (
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Motif du rejet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{candidature.motif_rejet}</p>
          </CardContent>
        </Card>
      )}

      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="font-medium">{utilisateur?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </p>
              <p className="font-medium">{utilisateur?.telephone || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sexe</p>
              <p className="font-medium">
                {candidat?.sexe === "M"
                  ? "Masculin"
                  : candidat?.sexe === "F"
                  ? "Féminin"
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">{formatDate(candidat?.date_naissance)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lieu de naissance</p>
              <p className="font-medium">{candidat?.lieu_naissance || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nationalité</p>
              <p className="font-medium">{candidat?.nationalite || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut matrimonial</p>
              <p className="font-medium">{candidat?.statut_matrimonial || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Handicap</p>
              <p className="font-medium">{candidat?.handicap || "Aucun"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Home className="h-4 w-4" />
              Adresse et origine
            </h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{candidat?.adresse || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Région d'origine</p>
                <p className="font-medium">{candidat?.region_origine || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ville d'origine</p>
                <p className="font-medium">{candidat?.ville_origine || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Département d'origine
                </p>
                <p className="font-medium">
                  {candidat?.departement_origine || "—"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pièce d'identité
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Numéro CNI</p>
                <p className="font-medium font-mono">
                  {candidat?.numero_cni || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de délivrance</p>
                <p className="font-medium">
                  {formatDate(candidat?.date_delivrance_cni)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations familiales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informations familiales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="font-semibold mb-2">Mère</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Nom : </span>
                  {candidat?.nom_mere || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Téléphone : </span>
                  {candidat?.telephone_mere || "—"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Père</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Nom : </span>
                  {candidat?.nom_pere || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Téléphone : </span>
                  {candidat?.telephone_pere || "—"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tuteur</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Nom : </span>
                  {candidat?.nom_tuteur || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Téléphone : </span>
                  {candidat?.telephone_tuteur || "—"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations scolaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Informations scolaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Niveau scolaire
              </p>
              <p className="font-medium">{candidat?.niveau_scolaire || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Filière d'origine</p>
              <p className="font-medium">{candidat?.filiere_origine || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Diplôme d'admission
              </p>
              <p className="font-medium">{candidat?.diplome_admission || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mention</p>
              <p className="font-medium">{candidat?.mention || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Année du diplôme</p>
              <p className="font-medium">{formatDate(candidat?.annee_diplome)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concours et Centres */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Concours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Concours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Libellé</p>
              <p className="font-medium">{concours?.libelle_concours}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">École</p>
              <p className="font-medium">
                {concours?.concours_filieres?.[0]?.filiere?.departement?.ecole
                  ?.libelle_ecole || "—"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Date limite</p>
                <p className="font-medium text-sm">
                  {formatDate(concours?.date_limite)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date examen</p>
                <p className="font-medium text-sm">
                  {formatDate(concours?.date_examen)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Centres */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Centres
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAffecterOpen(true)}
              >
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Centre de dépôt</p>
              <p className="font-medium">
                {candidature.centre_depot?.libelle_centre || "Non affecté"}
              </p>
              {candidature.centre_depot && (
                <p className="text-sm text-muted-foreground">
                  {candidature.centre_depot.ville_centre}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Centre d'examen</p>
              <p className="font-medium">
                {candidature.centre_examen?.libelle_centre || "Non affecté"}
              </p>
              {candidature.centre_examen && (
                <p className="text-sm text-muted-foreground">
                  {candidature.centre_examen.ville_centre} (
                  {candidature.centre_examen.capacite} places)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique */}
      {candidature.historiques && candidature.historiques.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidature.historiques.map((hist) => (
                <div key={hist.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{hist.etat.libelle_etat}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(hist.date_etat)}
                    </p>
                    {hist.commentaire && (
                      <p className="text-sm mt-1">{hist.commentaire}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ValiderCandidatureDialog
        open={validerOpen}
        onOpenChange={setValiderOpen}
        candidature={candidature}
        onSuccess={reloadData}
      />

      <RejeterCandidatureDialog
        open={rejeterOpen}
        onOpenChange={setRejeterOpen}
        candidature={candidature}
        onSuccess={reloadData}
      />

      <AffecterCentresDialog
        open={affecterOpen}
        onOpenChange={setAffecterOpen}
        candidature={candidature}
        onSuccess={reloadData}
      />
    </div>
  );
};

export default CandidatureDetails;