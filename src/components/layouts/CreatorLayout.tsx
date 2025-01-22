import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorLayoutProps {
  children: ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/creator/dashboard";
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-nino-bg">
      {!isMobile && <Sidebar />}
      <div className={`flex-1 p-4 md:p-8 ${isMobile ? 'w-full' : ''}`}>
        {!isDashboard && <DashboardHeader />}
        <main className="animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;