import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import MobileMenu from "../dashboard/MobileMenu";
import { usePrefetchData } from "@/hooks/usePrefetchData";

const BrandLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Use the prefetch hook
  usePrefetchData();

  return (
    <div className="flex min-h-screen bg-nino-bg">
      {isMobile && (
        <MobileMenu 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-x-hidden w-full">
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 py-6 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-nino-bg via-nino-bg/80 to-transparent" />
          <div className="relative">
            <DashboardHeader />
          </div>
        </div>
        
        <div className="p-4 pt-28 md:p-8 md:pt-32">
          <div key={location.pathname} className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandLayout;