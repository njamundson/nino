import { Route } from "react-router-dom";
import BrandLayout from "@/components/layouts/BrandLayout";
import ProtectedBrandRoute from "@/components/auth/ProtectedBrandRoute";
import Dashboard from "@/pages/Dashboard";
import MyCampaigns from "@/pages/MyCampaigns";
import ViewCreators from "@/pages/ViewCreators";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import BrandBookings from "@/pages/BrandBookings";
import NewCampaign from "@/pages/NewCampaign";
import CompletedProjects from "@/pages/CompletedProjects";

export const brandRoutes = [
  {
    path: "/brand/dashboard",
    element: (
      <ProtectedBrandRoute>
        <Dashboard />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/campaigns",
    element: (
      <ProtectedBrandRoute>
        <MyCampaigns />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/campaigns/new",
    element: (
      <ProtectedBrandRoute>
        <NewCampaign />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/creators",
    element: (
      <ProtectedBrandRoute>
        <ViewCreators />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/bookings",
    element: (
      <ProtectedBrandRoute>
        <BrandBookings />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/messages",
    element: (
      <ProtectedBrandRoute>
        <Messages />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/completed-projects",
    element: (
      <ProtectedBrandRoute>
        <CompletedProjects />
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/settings",
    element: (
      <ProtectedBrandRoute>
        <Settings />
      </ProtectedBrandRoute>
    ),
  },
];

export default brandRoutes;