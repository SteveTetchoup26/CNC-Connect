// src/components/candidatures/CandidatureCard.tsx
import { Calendar, MapPin, Download, MoreVertical, Bell, FileText, Eye, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface Candidature {
  id: number;
  statut: string;
  date_candidature: string;
  concours: {
    libelle_concours: string;
    date_examen: string;
    concours_filieres: Array<{
      filiere: {
        departement: {
          ecole: {
            libelle_ecole: string;
          };
        };
      };
    }>;
  };
  centre_examen: {
    libelle_centre: string;
    ville_centre: string;
  };
}

interface CandidatureCardProps {
  candidature: Candidature;
  onDefinirRappel: (candidature: Candidature) => void;
  onVoirDetails: (candidature: Candidature) => void;
  onTelechargerFiche: (candidatureId: number) => void;
  onTelechargerRecu: (candidatureId: number) => void;
}

const CandidatureCard = ({
  candidature,
  onDefinirRappel,
  onVoirDetails,
  onTelechargerFiche,
  onTelechargerRecu,
}: CandidatureCardProps) => {
   const [downloading, setDownloading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      EN_ATTENTE: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
      APPROUVEE: { label: "Approuvée", className: "bg-green-100 text-green-800" },
      REJETEE: { label: "Rejetée", className: "bg-red-100 text-red-800" },
      ADMIS: { label: "Admis", className: "bg-blue-100 text-blue-800" },
      NON_ADMIS: { label: "Non admis", className: "bg-gray-100 text-gray-800" },
    };

    const variant = variants[statut] || variants.EN_ATTENTE;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleDownloading = async (id: number) => {
    try {
      setDownloading(true);
      await onTelechargerFiche(id);
    } catch(error) {
      console.error(error)
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {getStatutBadge(candidature.statut)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDefinirRappel(candidature)}>
                <Bell className="mr-2 h-4 w-4" />
                Définir un rappel
              </DropdownMenuItem>
              <DropdownMenuItem disabled={true}>
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => onTelechargerRecu(candidature.id)}>
                <FileText className="mr-2 h-4 w-4" />
                Télécharger le reçu
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-lg mt-2">
          {candidature.concours.libelle_concours}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {candidature.concours.concours_filieres[0]?.filiere?.departement?.ecole?.libelle_ecole}
          </p>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
            <Calendar className="h-4 w-4" />
            <span>Examen: {formatDate(candidature.concours.date_examen)}</span>
          </div>

          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              {candidature.centre_examen.libelle_centre} — {candidature.centre_examen.ville_centre}
            </span>
          </div>
        </div>

        <Button 
          onClick={() => handleDownloading(candidature.id)}
          className="w-full bg-secondary hover:bg-secondary/90"
          disabled={downloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {downloading ? 'Téléchargement...' : 'Télécharger la fiche'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CandidatureCard;