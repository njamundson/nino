import { Route } from "react-router-dom";
import BrandLayout from "@/components/layouts/BrandLayout";
import ProtectedBrandRoute from "@/components/auth/ProtectedBrandRoute";
import Dashboard from "@/pages/Dashboard";
import NewCampaign from "@/pages/NewCampaign";
import MyCampaigns from "@/pages/MyCampaigns";
import ViewCreators from "@/pages/ViewCreators";
import Bookings from "@/pages/Bookings";
import Messages from "@/pages/Messages";
import Welcome from "@/pages/Welcome";

export const brandRoutes = [
  {
    path: "/brand/welcome",
    element: (
      <ProtectedBrandRoute>
        <Welcome />
      </ProtectedBrandRoute>
    ),
  },
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
          <Bookings />
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
];

export const BrandRoutes = () => {
  return (
    <>
      {brandRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default BrandRoutes;