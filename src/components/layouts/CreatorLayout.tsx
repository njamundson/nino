import { Suspense, memo, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";

// Static sidebar wrapper that never re-renders
const StaticSidebar = memo(() => <Sidebar />, () => true);
StaticSidebar.displayName = 'StaticSidebar';

// Static header wrapper that never re-renders
const StaticHeader = memo(() => <DashboardHeader />, () => true);
StaticHeader.displayName = 'StaticHeader';

// Optimized page transition component with fade animation
const PageTransition = memo(({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ 
      duration: 0.2,
      ease: "easeInOut"
    }}
    className="relative h-full"
  >
    {children}
  </motion.div>
));

PageTransition.displayName = 'PageTransition';

// Loading component with fade animation
const LoadingTransition = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="flex items-center justify-center h-[50vh]"
  >
    <div className="w-full max-w-md p-4">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-md animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>
      </div>
    </div>
  </motion.div>
);

const CreatorLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Preload all creator pages
  useEffect(() => {
    const preloadPages = async () => {
      const pages = [
        import("@/pages/Dashboard"),
        import("@/pages/Projects"),
        import("@/pages/Proposals"),
        import("@/pages/CompletedProjects"),
        import("@/pages/Bookings"),
        import("@/pages/Messages"),
        import("@/pages/Settings")
      ];
      await Promise.all(pages);
    };
    
    preloadPages();
  }, []);

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

        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname.split("/").slice(0, 3).join("/")}>
            <main className="p-4 pt-28 md:p-8 md:pt-32">
              <Suspense fallback={<LoadingTransition />}>
                <Outlet />
              </Suspense>
            </main>
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(CreatorLayout);