import Stepper from "@/components/concours/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InscriptionConcours = () => {
//     const handleSubmit = (data: any) => {
//     // 👉 Ici :
//     // - dispatch redux
//     // - appel API
//     // - navigation
//     console.log("Données inscription concours :", data);
//   };
  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-8xl">
        <CardHeader>
          <CardTitle className="text-lg">Inscription au concours</CardTitle>
        </CardHeader>

        <CardContent className="">
           <Stepper />
        </CardContent>
      </Card>
    </div>
  )
}

export default InscriptionConcours