import { ArrowRight, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"; // Ajoutez cette importation

const EntranceExamCard = ({
    id,
    libelle_concours: title,
    description,
    date_examen: date,
    isLoading = false, // Nouvelle prop optionnelle
    }: {
    id?: number;
    libelle_concours?: string;
    description?: string;
    date_examen?: Date;
    isLoading?: boolean; // Nouvelle prop
}) => {
    const navigate = useNavigate();

    const formatDate = (dt: Date) => {
        const date = new Date(dt);
        const day = date.getDate();
        const month = date.toLocaleString("fr-FR", { month: "long" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Si c'est un skeleton
    if (isLoading) {
        return (
            <Card className="h-60 flex flex-col justify-between">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-3/4" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
            </Card>
        );
    }

    // Si pas d'ID, ne pas rendre cliquable
    if (!id) return null;

    return (
        <Card onClick={() => navigate(`/concours/${id}`)} className="cursor-pointer hover:shadow-lg transition-shadow h-60 flex flex-col justify-between">
            <CardHeader className="">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="min-h-5 min-w-5 text-primary" />
                        {title || "Titre non disponible"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{description || "Description non disponible"}</p>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date du concours: {date ? formatDate(date) : "Non définie"}</span>
                </div>
                <Button className="cursor-pointer bg-secondary hover:bg-secondary-hover w-full">
                    Voir les détails
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default EntranceExamCard;