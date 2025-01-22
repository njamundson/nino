import { Route } from "react-router-dom";
import CreatorLayout from "@/components/layouts/CreatorLayout";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Proposals from "@/pages/Proposals";
import Bookings from "@/pages/Bookings";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import CompletedProjects from "@/pages/CompletedProjects";
import NinoWelcomeMessage from "@/components/onboarding/creator/NinoWelcomeMessage";

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

export const CreatorRoutes = () => {
  return (
    <>
      {creatorRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default CreatorRoutes;