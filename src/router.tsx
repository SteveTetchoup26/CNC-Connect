import { useRoutes } from "react-router-dom";
import { adminRoutes } from "./admin/routes/admin.routes";

// routes existantes
import MainLayout from "./components/shared/MainLayout";
import AuthLayout from "./components/shared/AuthLayout";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EntranceExamDetails from "./pages/concours/EntranceExamDetails";
import Candidatures from "./pages/Candidatures";
import ConcoursList from "./pages/concours/ConcoursList";
import ConcoursByRubrique from "./pages/concours/ConcoursByRubrique";
import InscriptionConcours from "./pages/concours/InscriptionConcours";

export default function AppRoutes() {
  return useRoutes([
    /* ---------- PUBLIC ---------- */
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/concours/:id", element: <EntranceExamDetails /> },
      ],
    },

    /* ---------- PRIVATE USER ---------- */
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { path: "/dashboard", element: <div>Dashboard</div> },
            { path: "/profile", element: <div>Profile</div> },
            { path: "/mes-inscriptions", element: <div>Mes inscriptions</div> },
            { path: "/concours", element: <ConcoursList /> },
            { path: "/concours/:id/enrolment", element: <InscriptionConcours /> },
            {
              path: "/concours/rubrique/:rubrique",
              element: <ConcoursByRubrique />,
            },
            { path: "/mes-candidatures", element: <Candidatures /> },
          ],
        },
      ],
    },

    /* ---------- GUEST ---------- */
    {
      element: <GuestRoute />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            { path: "/auth/login", element: <Login /> },
            { path: "/auth/register", element: <Register /> },
          ],
        },
      ],
    },

    ...adminRoutes,
  ]);
}
