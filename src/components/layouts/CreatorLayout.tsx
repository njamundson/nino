import { ReactNode, Suspense, memo } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";

interface CreatorLayoutProps {
  children: ReactNode;
}

// Memoize components to prevent unnecessary re-renders
const MemoizedHeader = memo(DashboardHeader);
const MemoizedSidebar = memo(Sidebar);

// Optimized page transition component
const PageTransition = memo(({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ 
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1.0]
    }}
  >
    {children}
  </motion.div>
));

PageTransition.displayName = 'PageTransition';

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

        {/* Implement smooth page transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <main className="p-4 pt-28 md:p-8 md:pt-32">
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </main>
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(CreatorLayout);