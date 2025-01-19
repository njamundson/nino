import { ReactNode } from "react";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useLocation } from "react-router-dom";

interface CreatorLayoutProps {
  children: ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/creator/dashboard";

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        {!isDashboard && <DashboardHeader />}
        {children}
      </div>
    </div>
  );
};

export default CreatorLayout;