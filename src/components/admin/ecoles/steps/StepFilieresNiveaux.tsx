import { type EcoleFormData, type Departement, type Filiere, type Niveau, type Matiere } from "@/types/ecole";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: EcoleFormData;
  setData: (data: EcoleFormData) => void;
}

export function StepFilieresNiveaux({ data, setData }: Props) {
  
  const updateDepartements = (newDeps: Departement[]) => {
    setData({ ...data, departements: newDeps });
  };

  const addFiliere = (depIndex: number) => {
    const copy = [...data.departements];
    copy[depIndex].filieres.push({
      libelle_filiere: "",
      code_filiere: "",
      description_filiere: "",
      niveaux: []
    });
    updateDepartements(copy);
  };

  const updateFiliere = (depIndex: number, filIndex: number, value: Partial<Filiere>) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex] = {
      ...copy[depIndex].filieres[filIndex],
      ...value
    };
    updateDepartements(copy);
  };

  const removeFiliere = (depIndex: number, filIndex: number) => {
    const copy = [...data.departements];
    copy[depIndex].filieres = copy[depIndex].filieres.filter((_, i) => i !== filIndex);
    updateDepartements(copy);
  };

  const addNiveau = (depIndex: number, filIndex: number) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex].niveaux.push({
      libelle_niveau: "",
      matieres: []
    });
    updateDepartements(copy);
  };

  const updateNiveau = (depIndex: number, filIndex: number, nivIndex: number, value: Partial<Niveau>) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex].niveaux[nivIndex] = {
      ...copy[depIndex].filieres[filIndex].niveaux[nivIndex],
      ...value
    };
    updateDepartements(copy);
  };

  const removeNiveau = (depIndex: number, filIndex: number, nivIndex: number) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex].niveaux = copy[depIndex].filieres[filIndex].niveaux.filter((_, i) => i !== nivIndex);
    updateDepartements(copy);
  };

  const addMatiere = (depIndex: number, filIndex: number, nivIndex: number) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex].niveaux[nivIndex].matieres.push({
      libelle_matiere: "",
      code_matiere: ""
    });
    updateDepartements(copy);
  };

  const updateMatiere = (depIndex: number, filIndex: number, nivIndex: number, matIndex: number, value: Partial<Matiere>) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex].niveaux[nivIndex].matieres[matIndex] = {
      ...copy[depIndex].filieres[filIndex].niveaux[nivIndex].matieres[matIndex],
      ...value
    };
    updateDepartements(copy);
  };

  const removeMatiere = (depIndex: number, filIndex: number, nivIndex: number, matIndex: number) => {
    const copy = [...data.departements];
    copy[depIndex].filieres[filIndex].niveaux[nivIndex].matieres = 
      copy[depIndex].filieres[filIndex].niveaux[nivIndex].matieres.filter((_, i) => i !== matIndex);
    updateDepartements(copy);
  };

  return (
    <div className="min-w-full space-y-6 p-1">
      <h3 className="text-lg font-semibold">Filières, niveaux et matières</h3>

      {data.departements.map((dep, depIndex) => (
        <div key={depIndex} className="border rounded-lg p-4 space-y-4 bg-muted/20">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              {dep.libelle_departement || `Département ${depIndex + 1}`}
            </h4>
            <Button
              size="sm"
              onClick={() => addFiliere(depIndex)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une filière
            </Button>
          </div>

          {dep.filieres.map((filiere, filIndex) => (
            <div key={filIndex} className="border rounded-lg p-4 space-y-4 bg-background">
              {/* Filière */}
              <div className="space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Nom de la filière"
                      value={filiere.libelle_filiere}
                      onChange={(e) =>
                        updateFiliere(depIndex, filIndex, { libelle_filiere: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Code"
                        value={filiere.code_filiere || ""}
                        onChange={(e) =>
                          updateFiliere(depIndex, filIndex, { code_filiere: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Description"
                        value={filiere.description_filiere || ""}
                        onChange={(e) =>
                          updateFiliere(depIndex, filIndex, { description_filiere: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFiliere(depIndex, filIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {/* Niveaux */}
              <div className="ml-4 space-y-3">
                {filiere.niveaux.map((niveau, nivIndex) => (
                  <div key={nivIndex} className="border-l-2 pl-4 space-y-2">
                    <div className="flex gap-2 items-start">
                      <Input
                        placeholder="Niveau (L1, L2, M1...)"
                        value={niveau.libelle_niveau}
                        onChange={(e) =>
                          updateNiveau(depIndex, filIndex, nivIndex, { libelle_niveau: e.target.value })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNiveau(depIndex, filIndex, nivIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>

                    {/* Matières */}
                    <div className="ml-4 space-y-2">
                      {niveau.matieres.map((matiere, matIndex) => (
                        <div key={matIndex} className="flex gap-2">
                          <Input
                            placeholder="Nom de la matière"
                            value={matiere.libelle_matiere}
                            onChange={(e) =>
                              updateMatiere(depIndex, filIndex, nivIndex, matIndex, {
                                libelle_matiere: e.target.value
                              })
                            }
                          />
                          <Input
                            placeholder="Code"
                            value={matiere.code_matiere || ""}
                            onChange={(e) =>
                              updateMatiere(depIndex, filIndex, nivIndex, matIndex, {
                                code_matiere: e.target.value
                              })
                            }
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMatiere(depIndex, filIndex, nivIndex, matIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addMatiere(depIndex, filIndex, nivIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter matière
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNiveau(depIndex, filIndex)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter niveau
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {data.departements.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Veuillez d'abord ajouter des départements à l'étape précédente
        </p>
      )}
    </div>
  );
}