import { lazy } from "react";
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
    path: "dashboard",
    element: (
      <ProtectedCreatorRoute>
        <Dashboard />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "projects",
    element: (
      <ProtectedCreatorRoute>
        <Projects />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "completed-projects",
    element: (
      <ProtectedCreatorRoute>
        <CompletedProjects />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "proposals",
    element: (
      <ProtectedCreatorRoute>
        <Proposals />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "applications",
    element: (
      <ProtectedCreatorRoute>
        <Applications />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "bookings",
    element: (
      <ProtectedCreatorRoute>
        <Bookings />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "messages",
    element: (
      <ProtectedCreatorRoute>
        <Messages />
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <ProtectedCreatorRoute>
        <Settings />
      </ProtectedCreatorRoute>
    ),
  },
];

export default creatorRoutes;