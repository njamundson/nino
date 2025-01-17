import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { brandRoutes } from "./routes/brandRoutes";
import { creatorRoutes } from "./routes/creatorRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "./hooks/use-toast";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// AuthWrapper component to handle authentication state
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        // Clear any stored auth data
        await supabase.auth.signOut();
        window.location.href = '/';
      }
    });

    // Check if the session is valid
    const validateSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          if (error.message.includes('User from sub claim in JWT does not exist')) {
            await supabase.auth.signOut();
            toast({
              title: "Session expired",
              description: "Please sign in again",
              variant: "destructive",
            });
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error validating session:', error);
      }
    };

    validateSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-nino-primary"></div>
      </div>
    );
  }

  // If user is authenticated and on the index page, redirect to appropriate dashboard
  if (session && window.location.pathname === '/') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <AuthWrapper>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public route */}
                <Route path="/" element={<Index />} />
                
                {/* Onboarding routes */}
                {onboardingRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}

                {/* Brand routes */}
                {brandRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}

                {/* Creator routes */}
                {creatorRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthWrapper>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;