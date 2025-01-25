import ProtectedRoute from "@/components/utility/ProtectedRoute";
import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const SettingsPage = lazy(() => import("@/pages/Settings"));

export const settingsRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="profile" replace />,
      },
      {
        path: ":section",
        element: <SettingsPage key={location.pathname} />,
      },
    ],
  },
];