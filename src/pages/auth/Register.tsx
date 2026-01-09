import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState, registerThunk } from "@/store/auth/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, success } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(registerThunk(formData));
  };

  useEffect(() => {
    if (success) {
      navigate("/auth/login");
    }
  }, [success, navigate]);

  useEffect(() => {
    dispatch(clearAuthState());
  }, []);

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side */}
      <section className="hidden md:flex flex-col justify-center px-12 bg-primary text-primary-foreground">
        <h1 className="text-4xl font-bold mb-4">Rejoignez-nous</h1>
        <p className="text-lg opacity-90 max-w-md">
          Créez votre compte pour participer aux{" "}
          <span className="text-secondary font-bold">concours disponibles</span>
          , suivre vos inscriptions et construire votre avenir académique.
        </p>
      </section>

      {/* Right side */}
      <section className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="px-8 py-2 space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold">Inscription</h2>
              <p className="text-muted-foreground">
                Créez votre compte étudiant
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              <div className="space-y-1">
                <Label className="mb-2" htmlFor="nom">
                  Nom(s) <span className="text-secondary">*</span>{" "}
                </Label>
                <Input
                  id="nom"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label className="mb-2" htmlFor="prenom">
                  Prénom(s)<span className="text-secondary">*</span>
                </Label>
                <Input
                  id="prenom"
                  type="text"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label className="mb-2" htmlFor="telephone">
                  Télephone
                </Label>
                <Input
                  id="telephone"
                  type="text"
                  placeholder="697775533"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label className="mb-2" htmlFor="email">
                  Email <span className="text-secondary">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label className="mb-2" htmlFor="password">
                  Mot de passe <span className="text-secondary">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label className="mb-2" htmlFor="password_confirmation">
                  Confirmer le mot de passe{" "}
                  <span className="text-secondary">*</span>
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover cursor-pointer"
              >
                {loading ? "Création..." : "Créer un compte"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <span
                onClick={() => navigate(`/auth/login`)}
                className="text-secondary cursor-pointer hover:underline"
              >
                Se connecter
              </span>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Register;
