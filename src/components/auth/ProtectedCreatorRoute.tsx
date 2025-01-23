import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error or no session:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        // Refresh session if it exists
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        // Check for creator profile
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id, onboarding_completed')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
          toast({
            title: "Error",
            description: "Failed to fetch creator profile",
            variant: "destructive",
          });
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (!creator) {
          console.log("No creator record found, redirecting to onboarding");
          if (mounted) {
            setIsAuthenticated(true);
            setOnboardingCompleted(false);
            setLoading(false);
          }
          return;
        }

        console.log("Creator found:", creator);
        if (mounted) {
          setIsAuthenticated(true);
          setOnboardingCompleted(creator.onboarding_completed || false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    // Initial check
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        await checkAuth();
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding/creator" replace />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;