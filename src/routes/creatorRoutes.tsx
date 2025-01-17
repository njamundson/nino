import { Route } from "react-router-dom";
import CreatorLayout from "@/components/layouts/CreatorLayout";
import ProtectedCreatorRoute from "@/components/auth/ProtectedCreatorRoute";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Proposals from "@/pages/Proposals";
import Bookings from "@/pages/Bookings";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Welcome from "@/pages/Welcome";

export const creatorRoutes = [
  {
    path: "/creator/welcome",
    element: (
      <ProtectedCreatorRoute>
        <Welcome />
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