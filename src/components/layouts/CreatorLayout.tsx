import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import PageHeader from "../shared/PageHeader";

interface CreatorLayoutProps {
  children: ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const location = useLocation();
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case "/creator/dashboard":
        return {
          title: "Dashboard",
          description: "Welcome back! Here's an overview of your activity"
        };
      case "/creator/projects":
        return {
          title: "Projects",
          description: "View and apply to projects"
        };
      case "/creator/completed-projects":
        return {
          title: "Completed Projects",
          description: `View your completed projects`
        };
      case "/creator/messages":
        return {
          title: "Messages",
          description: "Communicate with brands and manage your conversations"
        };
      case "/creator/settings":
        return {
          title: "Settings",
          description: "Manage your account preferences and profile"
        };
      default:
        return {
          title: "",
          description: ""
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        {headerInfo.title && (
          <PageHeader
            title={headerInfo.title}
            description={headerInfo.description}
          />
        )}
        <main className="animate-fadeIn mt-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;