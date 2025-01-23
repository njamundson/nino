import ProtectedBrandRoute from "@/components/auth/ProtectedBrandRoute";
import Dashboard from "@/pages/Dashboard";
import NewCampaign from "@/pages/NewCampaign";
import MyCampaigns from "@/pages/MyCampaigns";
import ViewCreators from "@/pages/ViewCreators";
import Bookings from "@/pages/Bookings";
import Messages from "@/pages/Messages";
import BrandSettings from "@/pages/BrandSettings";
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
    path: "/brand/campaigns/new",
    element: (
      <ProtectedBrandRoute>
        <NewCampaign />
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
        <Bookings />
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
        <BrandSettings />
      </ProtectedBrandRoute>
    ),
  },
];

export default brandRoutes;