import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ecoleService } from "@/services/ecoleService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { type Ecole } from "@/types/ecole";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const API_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

const EcoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ecole, setEcole] = useState<Ecole | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [banniereUrl, setBanniereUrl] = useState<string | null>(null);
  const [emblemeUrl, setEmblemeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // États pour les collapsibles
  const [openDeps, setOpenDeps] = useState<Record<number, boolean>>({});
  const [openFilieres, setOpenFilieres] = useState<Record<string, boolean>>({});
  const [openNiveaux, setOpenNiveaux] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;

    ecoleService.getById(Number(id)).then((response) => {
      setEcole(response.data);
      
      // Ne définir les URLs que si elles existent
      if (response.data?.logo_url) {
        setLogoUrl(`${API_URL}/storage/${response.data.logo_url}`);
      }
      if (response.data?.banniere_url) {
        setBanniereUrl(`${API_URL}/storage/${response.data.banniere_url}`);
      }
      if (response.data?.embleme_ecole) {
        setEmblemeUrl(`${API_URL}/storage/${response.data.embleme_ecole}`);
      }
      
      setLoading(false);
    });
  }, [id]);

  const toggleDep = (depId: number) => {
    setOpenDeps(prev => ({ ...prev, [depId]: !prev[depId] }));
  };

  const toggleFiliere = (key: string) => {
    setOpenFilieres(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNiveau = (key: string) => {
    setOpenNiveaux(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!ecole) {
    return <div className="p-6">École introuvable</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-semibold">{ecole.libelle_ecole}</h1>
      </div>

      {/* Infos générales */}
      <div className="rounded-lg border p-6 space-y-3">
        <h2 className="font-semibold text-lg">Informations générales</h2>

        <div><strong>Code :</strong> {ecole.code_ecole}</div>
        <div><strong>Localisation :</strong> {ecole.localisation}</div>
        <div><strong>Email :</strong> {ecole.email_ecole}</div>
        <div><strong>Téléphone :</strong> {ecole.telephone_ecole ?? "—"}</div>
        <div><strong>BP :</strong> {ecole.bp_ecole ?? "—"}</div>
        <div><strong>Site web :</strong> {ecole.siteweb_ecole ?? "—"}</div>
        {ecole.devise && (
          <div><strong>Devise :</strong> {ecole.devise}</div>
        )}
      </div>

      {/* Images - Affiche uniquement si au moins une image existe */}
      {(logoUrl || banniereUrl || emblemeUrl) && (
        <div className="rounded-lg border p-6 space-y-3">
          <h2 className="font-semibold text-lg">Images</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {logoUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Logo</p>
                <img 
                  src={logoUrl} 
                  alt="Logo de l'école" 
                  className="w-full h-32 object-contain border rounded"
                />
              </div>
            )}
            {banniereUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Bannière</p>
                <img 
                  src={banniereUrl} 
                  alt="Bannière de l'école" 
                  className="w-full h-32 object-cover border rounded"
                />
              </div>
            )}
            {emblemeUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Emblème</p>
                <img 
                  src={emblemeUrl} 
                  alt="Emblème de l'école" 
                  className="w-full h-32 object-contain border rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Départements / Filières / Niveaux / Matières */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Structure académique
        </h2>

        {!ecole.departements || ecole.departements.length === 0 ? (
          <p className="text-muted-foreground">Aucun département associé</p>
        ) : (
          <div className="space-y-3">
            {ecole.departements.map((departement) => (
              <Collapsible
                key={departement.id}
                open={openDeps[departement.id!]}
                onOpenChange={() => toggleDep(departement.id!)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {openDeps[departement.id!] ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="text-left">
                          <h3 className="font-semibold">
                            {departement.libelle_departement}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Code: {departement.code_departement}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {departement.filieres?.length || 0} filière(s)
                      </Badge>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {departement.description_departement && (
                        <p className="text-sm text-muted-foreground border-l-2 pl-3">
                          {departement.description_departement}
                        </p>
                      )}

                      {departement.filieres && departement.filieres.length > 0 ? (
                        <div className="space-y-2 ml-4">
                          {departement.filieres.map((filiere) => {
                            const filiereKey = `${departement.id}-${filiere.id}`;
                            return (
                              <Collapsible
                                key={filiere.id}
                                open={openFilieres[filiereKey]}
                                onOpenChange={() => toggleFiliere(filiereKey)}
                              >
                                <div className="border rounded-lg bg-muted/20">
                                  <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center gap-2">
                                        {openFilieres[filiereKey] ? (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <div className="text-left">
                                          <h4 className="font-medium">
                                            {filiere.libelle_filiere}
                                          </h4>
                                          {filiere.code_filiere && (
                                            <p className="text-xs text-muted-foreground">
                                              Code: {filiere.code_filiere}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <Badge variant="secondary" className="text-xs">
                                        {filiere.niveaux?.length || 0} niveau(x)
                                      </Badge>
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="px-3 pb-3 space-y-2">
                                      {filiere.description_filiere && (
                                        <p className="text-sm text-muted-foreground border-l-2 pl-2">
                                          {filiere.description_filiere}
                                        </p>
                                      )}

                                      {filiere.niveaux && filiere.niveaux.length > 0 ? (
                                        <div className="space-y-2 ml-3">
                                          {filiere.niveaux.map((niveau) => {
                                            const niveauKey = `${filiereKey}-${niveau.id}`;
                                            return (
                                              <Collapsible
                                                key={niveau.id}
                                                open={openNiveaux[niveauKey]}
                                                onOpenChange={() => toggleNiveau(niveauKey)}
                                              >
                                                <div className="border rounded-lg bg-background">
                                                  <CollapsibleTrigger className="w-full">
                                                    <div className="flex items-center justify-between p-2 hover:bg-muted/30 transition-colors">
                                                      <div className="flex items-center gap-2">
                                                        {openNiveaux[niveauKey] ? (
                                                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                                        ) : (
                                                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                        )}
                                                        <span className="font-medium text-sm">
                                                          {niveau.libelle_niveau}
                                                        </span>
                                                      </div>
                                                      <Badge variant="outline" className="text-xs">
                                                        {niveau.matieres?.length || 0} matière(s)
                                                      </Badge>
                                                    </div>
                                                  </CollapsibleTrigger>

                                                  <CollapsibleContent>
                                                    <div className="px-2 pb-2">
                                                      {niveau.matieres && niveau.matieres.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2 ml-5 mt-2">
                                                          {niveau.matieres.map((matiere) => (
                                                            <Badge key={matiere.id} variant="secondary">
                                                              {matiere.libelle_matiere}
                                                              {matiere.code_matiere && ` (${matiere.code_matiere})`}
                                                            </Badge>
                                                          ))}
                                                        </div>
                                                      ) : (
                                                        <p className="text-xs text-muted-foreground ml-5">
                                                          Aucune matière
                                                        </p>
                                                      )}
                                                    </div>
                                                  </CollapsibleContent>
                                                </div>
                                              </Collapsible>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground ml-3">
                                          Aucun niveau
                                        </p>
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </div>
                              </Collapsible>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground ml-4">
                          Aucune filière dans ce département
                        </p>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoleDetails;