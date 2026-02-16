import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { token, isAuthenticated, isAdmin } = useAuth();

  // Pas connecté
  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
