import { StrictMode, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { brandRoutes } from "./routes/brandRoutes";
import { creatorRoutes } from "./routes/creatorRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import AuthWrapper from "./components/auth/AuthWrapper";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
  </div>
);

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <AuthWrapper>
              <Suspense fallback={<LoadingFallback />}>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  {onboardingRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                  {brandRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                  {creatorRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                  {adminRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </Suspense>
            </AuthWrapper>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;