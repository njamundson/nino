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

export const brandRoutes = [
  {
    path: "/brand/dashboard",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <Dashboard />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/campaigns",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <MyCampaigns />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/campaigns/new",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <NewCampaign />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/creators",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <ViewCreators />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/bookings",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <BrandBookings />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/messages",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <Messages />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/settings",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <Settings />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
];

export default brandRoutes;