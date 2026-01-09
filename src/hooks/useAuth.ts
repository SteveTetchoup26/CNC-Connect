import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";

/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit des utilitaires pour vérifier les permissions et rediriger
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, token } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  /**
   * Vérifie si l'utilisateur a au moins un des rôles spécifiés
   */
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.some((role) => user.roles.includes(role));
  };

  /**
   * Vérifie si l'utilisateur a tous les rôles spécifiés
   */
  const hasAllRoles = (roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.every((role) => user.roles.includes(role));
  };

  /**
   * Redirige vers login si non authentifié
   */
  const requireAuth = (redirectTo?: string) => {
    if (!isAuthenticated) {
      navigate(redirectTo || "/auth/login");
      return false;
    }
    return true;
  };

  /**
   * Redirige vers accueil si déjà authentifié
   */
  const requireGuest = (redirectTo?: string) => {
    if (isAuthenticated) {
      navigate(redirectTo || "/");
      return false;
    }
    return true;
  };

  /**
   * Vérifie si l'utilisateur est un candidat
   */
  const isCandidat = (): boolean => {
    return hasRole("CANDIDAT");
  };

  /**
   * Vérifie si l'utilisateur est un admin
   */
  const isAdmin = (): boolean => {
    return hasAnyRole(["ADMIN", "SUPER_ADMIN"]);
  };

  return {
    // État
    isAuthenticated,
    user,
    loading,
    token,

    // Vérifications de rôles
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isCandidat,
    isAdmin,

    // Utilitaires de redirection
    requireAuth,
    requireGuest,
  };
};