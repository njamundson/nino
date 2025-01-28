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
      {/* Fixed sidebar - moved outside main content flow */}
      <aside className="fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <main className={`flex-1 ${isMobile ? 'w-full' : 'ml-64'}`}>
        {/* Fixed header */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-nino-bg/80 backdrop-blur-sm border-b border-gray-100/50">
          <div className="py-6 px-4 md:px-8">
            <DashboardHeader />
          </div>
        </header>

        {/* Main content */}
        <div className="relative mt-24 p-4 md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="w-full"
            >
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                {children}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CreatorLayout;