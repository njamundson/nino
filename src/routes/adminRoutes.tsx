import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/AdminDashboard";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
];