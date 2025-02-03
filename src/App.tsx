import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import Index from "./pages/Index";
import BrandLayout from "./components/layouts/BrandLayout";
import CreatorLayout from "./components/layouts/CreatorLayout";
import { brandRoutes } from "./routes/brandRoutes";
import { creatorRoutes } from "./routes/creatorRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { adminRoutes } from "./routes/adminRoutes";

// Configure query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnMount: "always",
      networkMode: "always"
    },
  },
});

// Session management component
const SessionManager = () => {
  useEffect(() => {
    // Set up periodic session refresh
    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          // Refresh session if it exists
          await supabase.auth.refreshSession();
          console.log("Session refreshed successfully");
        }
      } catch (error) {
        console.error("Session refresh error:", error);
      }
    }, 4 * 60 * 1000); // Refresh every 4 minutes

    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route index element={<Index />} />
        {onboardingRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
        <Route path="/brand" element={<BrandLayout />}>
          {brandRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/brand/', '')}
              element={route.element}
            />
          ))}
        </Route>
        <Route path="/creator" element={<CreatorLayout />}>
          {creatorRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/creator/', '')}
              element={route.element}
            />
          ))}
        </Route>
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="min-h-screen bg-nino-bg">
            <SessionManager />
            <Toaster />
            <Sonner />
            <AnimatedRoutes />
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;