import { Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Administration
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Connexion sécurisée
          </p>
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
