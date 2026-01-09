import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState, loginThunk } from "@/store/auth/authSlice";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";

const Login = () => {
    const navigate = useNavigate();
     const dispatch = useAppDispatch();

    const { loading, error, isAuthenticated, user } = useAppSelector(
        (state: RootState) => state.auth
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(
            loginThunk({
            email,
            password,
        })
        );
    };

    useEffect(() => {
    if (isAuthenticated && user) {
        // Exemple de redirection par rôle
        if (user.roles?.includes("admin")) {
            navigate("/admin/dashboard");
        } else {
            navigate("/");
        }
    }
    }, [isAuthenticated, user, navigate]);

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side */}
      <section className="hidden md:flex flex-col justify-center px-12 bg-primary text-primary-foreground">
        <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
        <p className="text-lg opacity-90 max-w-md">
          Accédez à votre espace personnel pour gérer vos <span className="text-secondary font-bold">inscriptions aux concours</span>,
          suivre votre statut et préparer votre avenir académique.
        </p>
      </section>

      {/* Right side */}
      <section className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold">Connexion</h2>
              <p className="text-muted-foreground">
                Connectez-vous à votre compte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <p className="text-sm text-red-500 text-center">
                        {error}
                    </p>
                )}
              <div className="space-y-1">
                <Label className="mb-2" htmlFor="email">Email</Label>
                <Input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}    
                    id="email" 
                    type="email" 
                    placeholder="exemple@email.com" />
              </div>

              <div className="space-y-1">
                <Label className="mb-2" htmlFor="password">Mot de passe</Label>
                <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover cursor-pointer"
                >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Vous n’avez pas de compte ?{" "}
              <span onClick={() => navigate(`/auth/register`)} className="text-secondary cursor-pointer hover:underline">
                Créer un compte
              </span>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Login;
