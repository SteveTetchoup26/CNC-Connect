import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "@/store/auth/authSlice";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      loginThunk({
        email,
        password,
      }),
    );
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.roles?.includes("ADMINISTRATEUR")) {
        navigate("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@sgee.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button className="w-full" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
