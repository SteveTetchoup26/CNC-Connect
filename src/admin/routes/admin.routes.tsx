import { type RouteObject } from "react-router-dom";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Centres from "../pages/Centres";
import Sessions from "../pages/Sessions";

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
                element: <Centres />
              },
              {
                path: "sessions",
                element: <Sessions />
              }
            ],
          },
        ],
      },
    ],
  },
];
