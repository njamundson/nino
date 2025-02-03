import { memo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";

// Optimized static components with explicit display names
const StaticSidebar = memo(() => <Sidebar />, () => true);
StaticSidebar.displayName = 'StaticSidebar';

const StaticHeader = memo(() => <DashboardHeader />, () => true);
StaticHeader.displayName = 'StaticHeader';

const CreatorLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-nino-bg">
      <StaticSidebar />
      
      <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 py-6 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-nino-bg via-nino-bg/95 to-transparent rounded-3xl" />
          <div className="relative">
            <StaticHeader />
          </div>
        </div>

        <main className="p-4 pt-28 md:p-8 md:pt-32">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default memo(CreatorLayout);