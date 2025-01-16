import Index from "@/pages/Index";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";
import Welcome from "@/pages/Welcome";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Proposals from "@/pages/Proposals";
import Bookings from "@/pages/Bookings";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import CreatorLayout from "@/components/layouts/CreatorLayout";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";

export const routes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/onboarding",
    element: <UserTypeSelection />
  },
  {
    path: "/onboarding/creator",
    element: <CreatorOnboarding />
  },
  {
    path: "/onboarding/brand",
    element: <BrandOnboarding />
  },
  {
    path: "/onboarding/brand/managers",
    element: <AccountManagersStep />
  },
  {
    path: "/welcome",
    element: (
      <ProtectedCreatorRoute>
        <Welcome />
      </ProtectedCreatorRoute>
    )
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Dashboard />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    )
  },
  {
    path: "/projects",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Projects />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    )
  },
  {
    path: "/proposals",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Proposals />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    )
  },
  {
    path: "/bookings",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Bookings />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    )
  },
  {
    path: "/messages",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Messages />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Settings />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    )
  }
];