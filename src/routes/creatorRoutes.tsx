import { lazy, Suspense } from "react";
import CreatorLayout from "@/components/layouts/CreatorLayout";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NinoWelcomeMessage from "@/components/onboarding/creator/NinoWelcomeMessage";

// Lazy load page components with better chunk naming
const Dashboard = lazy(() => import("@/pages/Dashboard" /* webpackChunkName: "creator-dashboard" */));
const Projects = lazy(() => import("@/pages/Projects" /* webpackChunkName: "creator-projects" */));
const Proposals = lazy(() => import("@/pages/Proposals" /* webpackChunkName: "creator-proposals" */));
const Bookings = lazy(() => import("@/pages/Bookings" /* webpackChunkName: "creator-bookings" */));
const Messages = lazy(() => import("@/pages/Messages" /* webpackChunkName: "creator-messages" */));
const Settings = lazy(() => import("@/pages/Settings" /* webpackChunkName: "creator-settings" */));
const CompletedProjects = lazy(() => import("@/pages/CompletedProjects" /* webpackChunkName: "creator-completed" */));

// Optimized loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner size="lg" className="text-nino-primary/40" />
  </div>
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
    path: "/creator/dashboard",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/projects",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <Projects />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/completed-projects",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <CompletedProjects />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/proposals",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <Proposals />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/bookings",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <Bookings />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/messages",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <Messages />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
  {
    path: "/creator/settings",
    element: (
      <ProtectedCreatorRoute>
        <CreatorLayout>
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        </CreatorLayout>
      </ProtectedCreatorRoute>
    ),
  },
];

export default creatorRoutes;