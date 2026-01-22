import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { concoursService, specificationService } from "@/services/concoursService";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Building2, 
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Concours, SpecificationConcours } from "@/types/concours";
import { toast } from "sonner";

const ConcoursDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [concours, setConcours] = useState<Concours | null>(null);
  const [specification, setSpecification] = useState<SpecificationConcours | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDeps, setOpenDeps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const concoursData = await concoursService.getById(Number(id));
        setConcours(concoursData);

        // Charger les spécifications si elles existent
        try {
          const specData = await specificationService.getByConcours(Number(id));
          setSpecification(specData);
        } catch {
          // Pas de spécifications
          setSpecification(null);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement du concours");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const toggleDep = (depId: number) => {
    setOpenDeps((prev) => ({ ...prev, [depId]: !prev[depId] }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const DOCUMENTS_LABELS: Record<string, string> = {
    carte_nationale_identite: "Carte Nationale d'Identité",
    diplomes: "Diplômes",
    certificat_nationalite: "Certificat de Nationalité",
    releve_notes: "Relevé de Notes",
    acte_naissance: "Acte de Naissance",
    photo: "Photo d'identité",
  };

  const getRequiredDocuments = () => {
    if (!specification) return [];
    
    return Object.entries(DOCUMENTS_LABELS)
      .filter(([key]) => specification[key as keyof SpecificationConcours] === true)
      .map(([, label]) => label);
  };

  // Grouper les filières par école
  const filieresByEcole = concours?.concours_filieres?.reduce((acc, cf) => {
    const ecoleName = cf.filiere?.departement?.ecole?.libelle_ecole || "Non spécifié";
    if (!acc[ecoleName]) {
      acc[ecoleName] = [];
    }
    acc[ecoleName].push(cf);
    return acc;
  }, {} as Record<string, typeof concours.concours_filieres>);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!concours) {
    return <div className="p-6">Concours introuvable</div>;
  }

  const requiredDocs = getRequiredDocuments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{concours.libelle_concours}</h1>
          {concours.sessions?.[0] && (
            <p className="text-muted-foreground">
              {concours.sessions[0].libelle_session}
            </p>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Date limite d'inscription</p>
              <p className="font-semibold text-lg">
                {formatDate(concours.date_limite)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'examen</p>
              <p className="font-semibold text-lg">
                {formatDate(concours.date_examen)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Frais */}
        {concours.frais_concours && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Frais de concours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Montant</p>
                <p className="font-bold text-2xl text-primary">
                  {concours.frais_concours.montant_frais.toLocaleString()} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Banque</p>
                <p className="font-medium">{concours.frais_concours.nom_banque}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numéro de compte</p>
                <p className="font-mono text-sm">
                  {concours.frais_concours.numero_compte}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Spécifications et Documents */}
      {specification && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Spécifications du concours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {specification.desc_infos_concours && (
              <div>
                <p className="text-sm font-medium mb-2">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {specification.desc_infos_concours}
                </p>
              </div>
            )}

            {requiredDocs.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">Documents requis</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {requiredDocs.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filières, Départements et Places */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Filières et places disponibles
          </CardTitle>
          <CardDescription>
            Total de {concours.concours_filieres?.length || 0} filière(s) disponible(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!filieresByEcole || Object.keys(filieresByEcole).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune filière associée
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(filieresByEcole).map(([ecoleName, filieres]) => {
                // const ecoleId = filieres[0]?.filiere?.departement?.ecole?.libelle_ecole || ecoleName;
                const totalPlaces = filieres.reduce((sum, cf) => sum + cf.nbre_places, 0);

                return (
                  <Collapsible
                    key={ecoleName}
                    open={openDeps[ecoleName.length]}
                    onOpenChange={() => toggleDep(ecoleName.length)}
                  >
                    <div className="border rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {openDeps[ecoleName.length] ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div className="text-left">
                              <h3 className="font-semibold">{ecoleName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {filieres.length} filière(s)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">{totalPlaces} places</Badge>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-2">
                          {filieres.map((cf) => (
                            <div
                              key={cf.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">
                                  {cf.filiere?.libelle_filiere}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {cf.filiere?.departement?.libelle_departement}
                                </p>
                                {cf.filiere?.niveaux && cf.filiere.niveaux.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {cf.filiere.niveaux.map((niveau) => (
                                      <Badge key={niveau.id} variant="secondary" className="text-xs">
                                        {niveau.libelle_niveau}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-primary">
                                  {cf.nbre_places}
                                </p>
                                <p className="text-xs text-muted-foreground">places</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des places
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {concours.concours_filieres?.reduce(
                (sum, cf) => sum + cf.nbre_places,
                0
              ) || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filières disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {concours.concours_filieres?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Écoles participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {filieresByEcole ? Object.keys(filieresByEcole).length : 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConcoursDetails;