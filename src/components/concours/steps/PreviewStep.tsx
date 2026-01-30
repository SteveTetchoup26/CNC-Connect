/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCentres } from "@/hooks/useCentres";

const PreviewStep = ({ data } : { data: any }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const { centresDepot, centresExamen } = useCentres();

  useEffect(() => {
    // Gestion de la photo
    if (data.photo instanceof File) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      
      reader.readAsDataURL(data.photo);
    } else {
      setPhotoPreview(null);
    }

    // Gestion de la fiche de paiement (pour l'aperçu si c'est une image)
    if (data.fiche_paiement instanceof File) {
      const file = data.fiche_paiement;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          setPaymentPreview(reader.result as string);
        };
        
        reader.readAsDataURL(file);
      }
    } else {
      setPaymentPreview(null);
    }
  }, [data.photo, data.fiche_paiement]);

  // Trouver les centres sélectionnés
  const centreDepotSelectionne = centresDepot.find(
    (c) => String(c.id) === data.centre_depot_id
  );
  const centreExamenSelectionne = centresExamen.find(
    (c) => String(c.id) === data.centre_examen_id
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        { label: "Région d'origine", value: data.region_origine },
        { label: "Département d'origine", value: data.departement_origine },
        { label: "Ville d'origine", value: data.ville_origine },
        { label: "Statut matrimonial", value: data.statut_matrimonial },
        { label: "Handicap", value: data.handicap || "Aucun" },
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
        { label: "Nom du tuteur", value: data.nom_tuteur || "Non renseigné" },
        { label: "Téléphone tuteur", value: data.telephone_tuteur || "Non renseigné" },
      ]
    },
    {
      title: "Informations scolaires",
      fields: [
        { label: "Niveau scolaire", value: data.niveau_scolaire },
        { label: "Filière d'origine", value: data.filiere_origine },
        { label: "Diplôme d'admission", value: data.diplome_admission },
        { label: "Mention", value: data.mention },
        { label: "Année du diplôme", value: data.annee_diplome },
      ]
    },
    {
      title: "Paiement",
      fields: [
        { label: "Numéro de reçu", value: data.num_recu },
        { 
          label: "Fiche de paiement", 
          value: data.fiche_paiement instanceof File 
            ? `${data.fiche_paiement.name} (${formatFileSize(data.fiche_paiement.size)})` 
            : "Aucun fichier" 
        },
      ]
    },
    {
      title: "Centres d'inscription et d'examen",
      fields: [
        { 
          label: "Centre de dépôt", 
          value: centreDepotSelectionne 
            ? `${centreDepotSelectionne.libelle_centre} — ${centreDepotSelectionne.ville_centre}` 
            : "Non sélectionné" 
        },
        { 
          label: "Centre d'examen", 
          value: centreExamenSelectionne 
            ? `${centreExamenSelectionne.libelle_centre} — ${centreExamenSelectionne.ville_centre}` 
            : "Non sélectionné" 
        },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bandeau d'information */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Vérifiez vos informations
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Veuillez vérifier attentivement toutes les informations avant de confirmer votre inscription.
          </p>
        </div>
      </div>

      {/* Photos et fichiers */}
      <div className="space-y-6">
        {/* Photo du candidat */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
            Photo du candidat
          </h3>
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Photo du candidat" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                  <User className="w-16 h-16 mb-2" />
                  <span className="text-sm">Aucune photo</span>
                </div>
              )}
            </div>
          </div>
          {data.photo instanceof File && (
            <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>{data.photo.name}</p>
              <p>{formatFileSize(data.photo.size)}</p>
            </div>
          )}
        </div>

        {/* Fiche de paiement (décommenter si besoin) */}
        {/*
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
            Fiche de paiement
          </h3>
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
              {paymentPreview ? (
                <img 
                  src={paymentPreview} 
                  alt="Fiche de paiement" 
                  className="w-full h-full object-contain p-2"
                />
              ) : data.fiche_paiement instanceof File ? (
                <div className="flex flex-col items-center text-gray-600 dark:text-gray-300">
                  <FileText className="w-16 h-16 mb-2 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm">{data.fiche_paiement.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(data.fiche_paiement.size)}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                  <FileText className="w-16 h-16 mb-2" />
                  <span className="text-sm">Aucun fichier</span>
                </div>
              )}
            </div>
          </div>
          {data.fiche_paiement instanceof File && (
            <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">{data.fiche_paiement.type}</p>
            </div>
          )}
        </div>
        */}
      </div>

      {/* Sections d'informations */}
      {sections.map((section, idx) => (
        <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
            {section.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {section.fields.map((field, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {field.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {field.value || <span className="text-gray-400 dark:text-gray-500 italic">Non renseigné</span>}
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