import { lazy, Suspense } from "react";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import NinoWelcomeMessage from "@/components/onboarding/creator/NinoWelcomeMessage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Wrap each lazy-loaded component with Suspense and a loading fallback
const LazyComponent = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  }>
    <Component />
  </Suspense>
);

// Lazy load components with explicit chunknames
const Dashboard = lazy(() => import("@/pages/Dashboard" /* webpackChunkName: "dashboard" */));
const Projects = lazy(() => import("@/pages/Projects" /* webpackChunkName: "projects" */));
const Proposals = lazy(() => import("@/pages/Proposals" /* webpackChunkName: "proposals" */));
const Applications = lazy(() => import("@/pages/Applications" /* webpackChunkName: "applications" */));
const Bookings = lazy(() => import("@/pages/Bookings" /* webpackChunkName: "bookings" */));
const Messages = lazy(() => import("@/pages/Messages" /* webpackChunkName: "messages" */));
const Settings = lazy(() => import("@/pages/Settings" /* webpackChunkName: "settings" */));
const CompletedProjects = lazy(() => import("@/pages/CompletedProjects" /* webpackChunkName: "completed-projects" */));

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
        {LazyComponent(Dashboard)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "projects",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(Projects)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "completed-projects",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(CompletedProjects)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "proposals",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(Proposals)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "applications",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(Applications)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "bookings",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(Bookings)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "messages",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(Messages)}
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <ProtectedCreatorRoute>
        {LazyComponent(Settings)}
      </ProtectedCreatorRoute>
    ),
  },
];

export default creatorRoutes;