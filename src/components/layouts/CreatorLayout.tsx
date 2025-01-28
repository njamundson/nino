import { ReactNode, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "../ui/loading-spinner";

interface CreatorLayoutProps {
  children: ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-nino-bg">
      {/* Fixed sidebar */}
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main content area with left margin to account for fixed sidebar */}
      <div className={`flex-1 ${isMobile ? 'w-full' : 'ml-64'}`}>
        {/* Fixed header */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20">
          <div className="relative py-6 px-4 md:px-8 bg-nino-bg/80 backdrop-blur-sm">
            <DashboardHeader />
          </div>
        </div>

        {/* Main content with padding for fixed header */}
        <div className="p-4 pt-28 md:p-8 md:pt-32">
          <Suspense 
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CreatorLayout;