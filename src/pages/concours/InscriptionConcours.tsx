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
           <Stepper />
        </CardContent>
      </Card>
    </div>
  )
}

export default InscriptionConcours