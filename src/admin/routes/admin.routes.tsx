import { type RouteObject } from "react-router-dom";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import CentresPage from "../pages/CentresPage";

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
                element: <CentresPage />
              }
            ],
          },
        ],
      },
    ],
  },
];
