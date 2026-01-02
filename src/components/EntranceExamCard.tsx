import { ArrowRight, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EntranceExamCard = ({
    title,
    description,
    date,
    }: {
    title: string;
    description: string;
    date: string
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
                <span>{date}</span>
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