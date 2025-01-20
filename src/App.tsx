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
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
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

    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (sessionError.message.includes('session_not_found')) {
            await handleSessionError();
            return;
          }
          throw sessionError;
        }

        if (!session) {
          console.log('No active session found during initialization');
          navigate('/');
          if (mounted) {
            setIsInitialized(true);
            setIsLoading(false);
          }
          return;
        }

        // Verify session is still valid
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('User verification error:', userError);
          if (userError.message.includes('session_not_found')) {
            await handleSessionError();
            return;
          }
          throw userError;
        }

        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        await handleSessionError();
      }
    };

    const handleSessionError = async () => {
      console.log('Session error detected, signing out...');
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
      navigate('/');
      if (mounted) {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    // Initial session check
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Session ended",
          description: "Please sign in again to continue.",
        });
        navigate('/');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
        // Verify the session is valid after sign in
        const { error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error verifying user after sign in:', error);
          await handleSessionError();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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