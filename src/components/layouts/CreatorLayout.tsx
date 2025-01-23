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
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
        <div className="p-4 md:p-8">
          <DashboardHeader />
          <main className="animate-fadeIn mt-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatorLayout;