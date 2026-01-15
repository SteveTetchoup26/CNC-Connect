/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCentres } from "@/hooks/useCentres";

const PreviewStep = ({ data } : { data: any }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { centresDepot, centresExamen } = useCentres();

  useEffect(() => {
    if (data.photo?.[0]) {
      const file = data.photo[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }, [data.photo]);

  // Trouver les centres sélectionnés
  const centreDepotSelectionne = centresDepot.find(
    (c) => String(c.id) === data.centre_depot_id
  );
  const centreExamenSelectionne = centresExamen.find(
    (c) => String(c.id) === data.centre_examen_id
  );

  const sections = [
    {
      title: "Informations personnelles",
      fields: [
        { label: "Nom", value: data.nom },
        { label: "Prénom", value: data.prenom },
        { label: "Adresse", value: data.adresse },
        { label: "Nationalité", value: data.nationalite },
        { label: "Sexe", value: data.sexe === "M" ? "Masculin" : data.sexe === "F" ? "Féminin" : "" },
        { label: "Date de naissance", value: data.date_naissance },
        { label: "Lieu de naissance", value: data.lieu_naissance },
      ]
    },
    {
      title: "Pièce d'identité",
      fields: [
        { label: "Numéro CNI", value: data.numero_cni },
        { label: "Date de délivrance", value: data.date_delivrance_cni },
      ]
    },
    {
      title: "Informations familiales",
      fields: [
        { label: "Nom de la mère", value: data.nom_mere },
        { label: "Téléphone mère", value: data.telephone_mere },
        { label: "Nom du père", value: data.nom_pere },
        { label: "Téléphone père", value: data.telephone_pere },
      ]
    },
    {
      title: "Informations scolaires",
      fields: [
        { label: "Niveau scolaire", value: data.niveau_scolaire },
        { label: "Filière d'origine", value: data.filiere_origine },
        { label: "Diplôme d'admission", value: data.diplome_admission },
        { label: "Mention", value: data.mention },
      ]
    },
    {
      title: "Paiement",
      fields: [
        { label: "Numéro de reçu", value: data.num_recu },
        { label: "Fiche de paiement", value: data.fiche_paiement?.[0]?.name || "Aucun fichier" },
      ]
    },
    {
      title: "Centres d'inscription et d'examen",
      fields: [
        { 
          label: "Centre de dépôt", 
          value: centreDepotSelectionne 
            ? `${centreDepotSelectionne.libelle_centre} — ${centreDepotSelectionne.ville_centre}` 
            : null 
        },
        { 
          label: "Centre d'examen", 
          value: centreExamenSelectionne 
            ? `${centreExamenSelectionne.libelle_centre} — ${centreExamenSelectionne.ville_centre}` 
            : null 
        },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Vérifiez vos informations
          </h3>
          <p className="text-sm text-blue-700">
            Veuillez vérifier attentivement toutes les informations avant de confirmer votre inscription.
          </p>
        </div>
      </div>

      {/* Photo du candidat */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">
          Photo du candidat
        </h3>
        <div className="flex justify-center">
          <div className="w-40 h-40 rounded-lg border-2 border-gray-300 overflow-hidden bg-white flex items-center justify-center">
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Photo du candidat" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <User className="w-16 h-16 mb-2" />
                <span className="text-sm">Aucune photo</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            {section.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {section.fields.map((field, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">{field.label}</span>
                <span className="font-medium text-gray-900">
                  {field.value || <span className="text-gray-400 italic">Non renseigné</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewStep;