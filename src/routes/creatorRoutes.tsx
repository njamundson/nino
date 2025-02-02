import { lazy, Suspense } from "react";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import NinoWelcomeMessage from "@/components/onboarding/creator/NinoWelcomeMessage";
import { motion } from "framer-motion";

// Optimized loading fallback with smooth animation
const LoadingFallback = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center justify-center min-h-[200px]"
  />
);

// Lazy load components with explicit chunk names and preload hints
const Dashboard = lazy(() => import("@/pages/Dashboard" /* webpackChunkName: "creator-dashboard" */));
const Projects = lazy(() => import("@/pages/Projects" /* webpackChunkName: "creator-projects" */));
const Proposals = lazy(() => import("@/pages/Proposals" /* webpackChunkName: "creator-proposals" */));
const Applications = lazy(() => import("@/pages/Applications" /* webpackChunkName: "creator-applications" */));
const Bookings = lazy(() => import("@/pages/Bookings" /* webpackChunkName: "creator-bookings" */));
const Messages = lazy(() => import("@/pages/Messages" /* webpackChunkName: "creator-messages" */));
const Settings = lazy(() => import("@/pages/Settings" /* webpackChunkName: "creator-settings" */));
const CompletedProjects = lazy(() => import("@/pages/CompletedProjects" /* webpackChunkName: "creator-completed" */));

// Wrap lazy components with Suspense and minimal loading state
const LazyComponent = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

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