import { RouteObject } from "react-router-dom";
import BrandLayout from "@/components/layouts/BrandLayout";
import BrandDashboard from "@/pages/Dashboard";
import MyCampaigns from "@/pages/MyCampaigns";
import NewCampaign from "@/pages/NewCampaign";
import ViewCreators from "@/pages/ViewCreators";
import Messages from "@/pages/Messages";
import BrandSettings from "@/pages/BrandSettings";
import { Outlet } from "react-router-dom";

export const brandRoutes: RouteObject[] = [
  {
    path: "brand",
    element: <BrandLayout><Outlet /></BrandLayout>,
    children: [
      {
        path: "dashboard",
        element: <BrandDashboard />,
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
        path: "messages",
        element: <Messages />,
      },
      {
        path: "settings",
        element: <BrandSettings />,
      },
    ],
  },
];

export default brandRoutes;