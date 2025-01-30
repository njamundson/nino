import { ReactNode, Suspense, memo } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "../ui/loading-spinner";

interface CreatorLayoutProps {
  children: ReactNode;
}

// Memoize the header to prevent unnecessary re-renders
const MemoizedHeader = memo(DashboardHeader);
const MemoizedSidebar = memo(Sidebar);

// Memoized loading component for better performance
const PageLoader = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center justify-center min-h-[60vh]"
  >
    <LoadingSpinner size="lg" className="text-nino-primary/40" />
  </motion.div>
));

PageLoader.displayName = 'PageLoader';

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-nino-bg">
      {/* Persist Sidebar across navigation */}
      <MemoizedSidebar />
      
      <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
        {/* Persist Header across navigation */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 py-6 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-nino-bg via-nino-bg/95 to-transparent rounded-3xl" />
          <div className="relative">
            <MemoizedHeader />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="p-4 pt-28 md:p-8 md:pt-32"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
          >
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(CreatorLayout);