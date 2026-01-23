import { type RouteObject } from "react-router-dom";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Centres from "../pages/Centres";
import Sessions from "../pages/Sessions";
import Ecoles from "../pages/Ecoles";
import EcoleDetails from "../pages/EcoleDetails";
import ConcoursPage from "../pages/Concours";
import ConcoursDetails from "../pages/ConcoursDetails";
import CandidaturesPage from "../pages/Candidatures";
import CandidatureDetails from "../pages/CandidatureDetails";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    children: [
      {
        element: <AdminAuthLayout />,
        children: [
          {
            path: "login",
            element: <AdminLogin />,
          },
        ],
      },

      {
        element: <AdminProtectedRoute />,
        children: [
          {
            path: "",
            element: <AdminLayout />,
            children: [
              {
                path: "dashboard",
                element: <div>Yooo</div>,
              },
              {
                path: "centres",
                element: <Centres />,
              },
              {
                path: "sessions",
                element: <Sessions />,
              },
              {
                path: "ecoles",
                element: <Ecoles />,
              },
              {
                path: "ecoles/:id",
                element: <EcoleDetails />,
              },
              {
                path: "concours",
                element: <ConcoursPage />,
              },
              {
                path: "concours/:id",
                element: <ConcoursDetails />,
              },
              {
                path: "candidatures",
                element: <CandidaturesPage />,
              },
              {
                path: "candidatures/:id",
                element: <CandidatureDetails />,
              },
            ],
          },
        ],
      },
    ],
  },
];
