import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import BrandLayout from "./components/layouts/BrandLayout";
import CreatorLayout from "./components/layouts/CreatorLayout";
import { brandRoutes } from "./routes/brandRoutes";
import { creatorRoutes } from "./routes/creatorRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { adminRoutes } from "./routes/adminRoutes";

// Optimize query client configuration for better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnMount: "always",
      networkMode: "always"
    },
  },
});

// Prefetch auth session
queryClient.prefetchQuery({
  queryKey: ['auth-session'],
  queryFn: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
});

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