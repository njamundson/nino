import { lazy } from "react";
import CreatorLayout from "@/components/layouts/CreatorLayout";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import NinoWelcomeMessage from "@/components/onboarding/creator/NinoWelcomeMessage";

// Implement code splitting with preloading for faster transitions
const Dashboard = lazy(() => {
  const module = import("@/pages/Dashboard");
  // Preload the next probable routes
  import("@/pages/Projects");
  import("@/pages/Messages");
  return module;
});

const Projects = lazy(() => {
  const module = import("@/pages/Projects");
  // Preload related routes
  import("@/pages/Proposals");
  import("@/pages/CompletedProjects");
  return module;
});

const Proposals = lazy(() => {
  const module = import("@/pages/Proposals");
  return module;
});

const Bookings = lazy(() => {
  const module = import("@/pages/Bookings");
  return module;
});

const Messages = lazy(() => {
  const module = import("@/pages/Messages");
  return module;
});

const Settings = lazy(() => {
  const module = import("@/pages/Settings");
  return module;
});

const CompletedProjects = lazy(() => {
  const module = import("@/pages/CompletedProjects");
  return module;
});

export const creatorRoutes = [
  {
    path: "/creator/welcome",
    element: (
      <ProtectedCreatorRoute>
        <NinoWelcomeMessage />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/dashboard",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Dashboard />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/projects",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Projects />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/completed-projects",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <CompletedProjects />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/proposals",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Proposals />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/bookings",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Bookings />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/messages",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Messages />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/settings",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Settings />
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
];

export default creatorRoutes;