import Stepper from "@/components/concours/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InscriptionConcours = () => {
  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-8xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Inscription au concours</CardTitle>
        </CardHeader>

        <CardContent className="">
          <div className="mb-4">
            <p>
              • Le processus d’inscription est découpé en 6 étapes indépendantes. Vous pouvez à tout moment revenir à l’étape précédente. La validation définitive se fera en étape 6.
            </p>
            <p>
              • La présence d’une astérisque <span className="text-secondary">*</span> indique que le champ est obligatoire.
            </p>
          </div>
           <Stepper />
        </CardContent>
      </Card>
    </div>
  )
}

export default InscriptionConcours