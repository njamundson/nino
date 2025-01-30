import { lazy } from "react";
import CreatorLayout from "@/components/layouts/CreatorLayout";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import NinoWelcomeMessage from "@/components/onboarding/creator/NinoWelcomeMessage";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Projects = lazy(() => import("@/pages/Projects"));
const Proposals = lazy(() => import("@/pages/Proposals"));
const Applications = lazy(() => import("@/pages/Applications"));
const Bookings = lazy(() => import("@/pages/Bookings"));
const Messages = lazy(() => import("@/pages/Messages"));
const Settings = lazy(() => import("@/pages/Settings"));
const CompletedProjects = lazy(() => import("@/pages/CompletedProjects"));

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
    path: "/creator/applications",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Applications />
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