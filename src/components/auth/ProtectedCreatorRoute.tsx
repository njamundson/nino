import { useEffect, useState, useCallback } from "react";
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

  const checkCreatorProfile = useCallback(async (userId: string) => {
    try {
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id, onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        toast({
          title: "Error",
          description: "Failed to fetch creator profile",
          variant: "destructive",
        });
        return { isAuth: false, onboarding: false };
      }

      if (!creator) {
        console.log("No creator record found, redirecting to onboarding");
        return { isAuth: true, onboarding: false };
      }

      console.log("Creator found:", creator);
      return { 
        isAuth: true, 
        onboarding: creator.onboarding_completed || false 
      };
    } catch (error) {
      console.error('Error in checkCreatorProfile:', error);
      return { isAuth: false, onboarding: false };
    }
  }, [toast]);

  const checkAuth = useCallback(async () => {
    try {
      console.log("Checking authentication status...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return { isAuth: false, onboarding: false };
      }

      if (!session) {
        console.log("No session found");
        return { isAuth: false, onboarding: false };
      }

      return await checkCreatorProfile(session.user.id);
    } catch (error) {
      console.error('Error in checkAuth:', error);
      toast({
        title: "Authentication Error",
        description: "Please sign in again",
        variant: "destructive",
      });
      return { isAuth: false, onboarding: false };
    }
  }, [checkCreatorProfile, toast]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { isAuth, onboarding } = await checkAuth();
      if (mounted) {
        setIsAuthenticated(isAuth);
        setOnboardingCompleted(onboarding);
        setLoading(false);
      }
    };

    // Initial check
    initializeAuth();

    // Set up auth state listener with debounced handler
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAuthenticated(false);
          setOnboardingCompleted(false);
          setLoading(false);
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { isAuth, onboarding } = await checkAuth();
        if (mounted) {
          setIsAuthenticated(isAuth);
          setOnboardingCompleted(onboarding);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAuth]);

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