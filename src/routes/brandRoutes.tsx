import { Route } from "react-router-dom";
import BrandLayout from "@/components/layouts/BrandLayout";
import ProtectedBrandRoute from "@/components/auth/ProtectedBrandRoute";
import Dashboard from "@/pages/Dashboard";
import Proposals from "@/pages/Proposals";
import Bookings from "@/pages/Bookings";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
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
    path: "/brand/campaign/new",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <div>New Campaign Page</div>
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/campaigns",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <div>My Campaigns Page</div>
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/creators",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <div>View Creators Page</div>
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
  },
  {
    path: "/brand/proposals",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <Proposals />
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

export const BrandRoutes = () => {
  return (
    <>
      {brandRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};