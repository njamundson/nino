import { Suspense, memo, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// Static components that never re-render
const StaticSidebar = memo(() => <Sidebar />, () => true);
StaticSidebar.displayName = 'StaticSidebar';

const StaticHeader = memo(() => <DashboardHeader />, () => true);
StaticHeader.displayName = 'StaticHeader';

// Optimized page transition component with better animation timing
const PageTransition = memo(({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0.95, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0.95, y: 0 }}
    transition={{ 
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1]
    }}
    className="relative h-full"
  >
    {children}
  </motion.div>
));

PageTransition.displayName = 'PageTransition';

// Minimal loading fallback that maintains layout
const MinimalLoadingFallback = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-[200px]"
  />
);

const CreatorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Preload all creator pages immediately on mount
  useEffect(() => {
    const preloadRoutes = async () => {
      // Preload all routes in parallel
      await Promise.all([
        import("@/pages/Dashboard"),
        import("@/pages/Projects"),
        import("@/pages/Proposals"),
        import("@/pages/CompletedProjects"),
        import("@/pages/Bookings"),
        import("@/pages/Messages"),
        import("@/pages/Settings"),
        import("@/pages/Applications")
      ]);
    };

    // Start preloading immediately
    void preloadRoutes();

    // Prefetch data for common routes
    const prefetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Prefetch creator profile
      await supabase
        .from('creators')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // Prefetch recent messages
      await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);
    };

    void prefetchData();
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
              <Suspense fallback={<MinimalLoadingFallback />}>
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