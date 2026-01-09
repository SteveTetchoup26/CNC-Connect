import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
