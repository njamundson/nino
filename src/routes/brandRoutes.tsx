import { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import BrandLayout from "@/components/layouts/BrandLayout";
import Dashboard from "@/pages/Dashboard";
import BrandSettings from "@/pages/BrandSettings";
import Messages from "@/pages/Messages";
import MyCampaigns from "@/pages/MyCampaigns";
import NewCampaign from "@/pages/NewCampaign";
import ViewCreators from "@/pages/ViewCreators";
import Proposals from "@/pages/Proposals";
import ProtectedBrandRoute from "@/components/auth/ProtectedBrandRoute";

const brandRoutes: RouteObject[] = [
  {
    path: "brand",
    element: (
      <ProtectedBrandRoute>
        <BrandLayout>
          <Outlet />
        </BrandLayout>
      </ProtectedBrandRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <BrandSettings />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "campaigns",
        element: <MyCampaigns />,
      },
      {
        path: "campaigns/new",
        element: <NewCampaign />,
      },
      {
        path: "creators",
        element: <ViewCreators />,
      },
      {
        path: "proposals",
        element: <Proposals />,
      },
    ],
  },
];

export default brandRoutes;