import { useEffect, useState, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "../dashboard/MobileMenu";
import { usePrefetchData } from "@/hooks/usePrefetchData";
import { LoadingSpinner } from "../ui/loading-spinner";

const BrandLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

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

      <div className={`flex-1 overflow-x-hidden w-full ${isMobile ? 'px-0' : ''}`}>
        <div className={`fixed top-0 right-0 left-0 lg:left-64 z-20 py-6 ${isMobile ? 'px-4' : 'px-8'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-nino-bg via-nino-bg/95 to-transparent rounded-3xl" />
          <div className="relative">
            <DashboardHeader />
          </div>
        </div>
        
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className={`pt-28 pb-8 ${isMobile ? 'px-4' : 'px-8'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense 
              fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrandLayout;