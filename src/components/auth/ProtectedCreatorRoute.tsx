import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found, redirecting to auth");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Use maybeSingle() instead of single() to handle no results gracefully
        const { data: creator, error } = await supabase
          .from('creators')
          .select('id, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching creator:', error);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // If no creator record exists, we still authenticate but set onboarding as incomplete
        if (!creator) {
          console.log("No creator record found, redirecting to onboarding");
          setIsAuthenticated(true);
          setOnboardingCompleted(false);
          setLoading(false);
          return;
        }

        console.log("Creator found:", creator);
        setIsAuthenticated(true);
        setOnboardingCompleted(creator.onboarding_completed || false);
        setLoading(false);
      } catch (error) {
        console.error('Error in checkAuth:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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