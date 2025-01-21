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
import { adminRoutes } from "./routes/adminRoutes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Clear session if there's an invalid refresh token
        const currentSession = await supabase.auth.getSession();
        if (currentSession.error?.message?.includes('refresh_token_not_found')) {
          console.log('Invalid refresh token detected, clearing session');
          await supabase.auth.signOut();
          if (window.location.pathname !== '/') {
            navigate('/');
          }
          return;
        }

        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          // If the error is related to refresh token, clear the session
          if (sessionError.message?.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
          }
          throw sessionError;
        }

        // If no session and not on index page, redirect to index
        if (!session && window.location.pathname !== '/') {
          navigate('/');
          return;
        }

        // If session exists, verify it's still valid
        if (session) {
          const { error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error('User verification error:', userError);
            await supabase.auth.signOut();
            toast({
              title: "Session expired",
              description: "Please sign in again to continue.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
        }

        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          // Clear the session on error
          await supabase.auth.signOut();
          setIsInitialized(true);
          setIsLoading(false);
          if (window.location.pathname !== '/') {
            navigate('/');
          }
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Handle token refresh failure
        if (!session && event === 'TOKEN_REFRESHED') {
          console.error('Token refresh failed');
          navigate('/');
          return;
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      } else if (event === 'SIGNED_IN') {
        await initializeAuth();
      }
    });

    // Initial auth check
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Only protect non-index routes
  const isIndexRoute = window.location.pathname === '/';
  if (isIndexRoute) {
    return <>{children}</>;
  }

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nino-bg">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
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