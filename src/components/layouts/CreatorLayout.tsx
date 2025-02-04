import { Suspense, memo, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Menu } from "lucide-react";

const StaticSidebar = memo(() => <Sidebar />, () => true);
StaticSidebar.displayName = 'StaticSidebar';

const StaticHeader = memo(() => <DashboardHeader />, () => true);
StaticHeader.displayName = 'StaticHeader';

const Logo = memo(() => (
  <img 
    src="/lovable-uploads/750e93fc-c7bd-41ae-bd2f-42877db3bd66.png" 
    alt="NINO" 
    className="h-24 w-auto"
    loading="eager"
    fetchPriority="high"
    decoding="sync"
    style={{ 
      imageRendering: 'crisp-edges',
      willChange: 'transform'
    }}
  />
));

Logo.displayName = 'Logo';

const LoadingFallback = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="min-h-[200px] flex items-center justify-center"
  >
    <LoadingSpinner size="lg" className="text-nino-primary" />
  </motion.div>
);

const PageTransition = memo(({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4 }}
    transition={{ 
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.5,
      duration: 0.3
    }}
    className="relative h-full w-full"
  >
    {children}
  </motion.div>
));

PageTransition.displayName = 'PageTransition';

const CreatorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Preload all creator pages immediately on mount
  useEffect(() => {
    const preloadRoutes = async () => {
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

    void preloadRoutes();

    // Prefetch common data
    const prefetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      await Promise.all([
        supabase
          .from('creators')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle(),

        supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);
    };

    void prefetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <StaticSidebar />
      
      <div className={`flex-1 ${isMobile ? 'w-full px-4' : ''}`}>
        <div className={`fixed top-0 right-0 left-0 lg:left-64 z-20 ${isMobile ? 'px-4' : 'px-8'}`}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-nino-bg via-nino-bg/95 to-transparent rounded-3xl"
          />
          <div className="relative py-8">
            {isMobile ? (
              <div className="flex items-center justify-between h-24">
                <div className="flex items-center justify-center w-16">
                  <Menu className="h-8 w-8 text-nino-text" />
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <Logo />
                </div>
                <div className="w-16 flex items-center justify-end">
                  <StaticHeader />
                </div>
              </div>
            ) : (
              <StaticHeader />
            )}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <main className={`pt-32 pb-8 ${isMobile ? 'px-0' : 'px-8'}`}>
              <Suspense fallback={<LoadingFallback />}>
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
