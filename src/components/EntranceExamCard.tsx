import { ArrowRight, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const EntranceExamCard = ({
    id,
    libelle_concours: title,
    description,
    date_examen: date,
    }: {
    id: number;
    libelle_concours: string;
    description: string;
    date_examen: Date
}) => {
    const navigate = useNavigate();

    const formatDate = (dt: Date) => {
        const date = new Date(dt);
        const day = date.getDate();
        const month = date.toLocaleString("fr-FR", { month: "long" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
  return (
    <Card onClick={() => navigate(`/concours/${id}`)} className="cursor-pointer hover:shadow-lg transition-shadow h-60 flex flex-col justify-between">
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                    {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date du concours: {formatDate(date)}</span>
            </div>
            <Button className="cursor-pointer bg-primary hover:bg-primary-hover w-full">
                Voir les détails
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardContent>
    </Card>
  )
}

export default EntranceExamCard