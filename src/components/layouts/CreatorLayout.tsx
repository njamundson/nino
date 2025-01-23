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
      <Sidebar />
      <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-nino-bg py-4 px-4 md:px-8">
          <DashboardHeader />
        </div>
        <div className="p-4 pt-20 md:p-8 md:pt-24">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
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