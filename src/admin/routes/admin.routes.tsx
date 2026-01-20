import { type RouteObject } from "react-router-dom";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";

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
            path: "dashboard",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <div>Yooo</div>,
              },
            ],
          },
        ],
      },
    ],
  },
];
