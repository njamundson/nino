import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Authentication Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (!session) {
          console.log('No session found');
          navigate('/');
          return;
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (event === 'SIGNED_OUT' || !currentSession) {
              navigate('/');
              return;
            }
          }
        );

        // Check if user has a creator profile
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id, onboarding_completed')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error fetching creator profile:', creatorError);
          toast({
            title: "Error",
            description: "Could not verify creator access. Please try again.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        const isOnboardingRoute = location.pathname.includes('/onboarding');
        const isWelcomeRoute = location.pathname === '/onboarding/creator/welcome';

        if (!creator) {
          console.log('No creator profile found');
          navigate('/');
          return;
        }

        if (creator.onboarding_completed) {
          // If onboarding is complete
          if (isOnboardingRoute && !isWelcomeRoute) {
            // Redirect to dashboard if trying to access onboarding routes
            navigate('/creator/dashboard', { replace: true });
          } else {
            setHasAccess(true);
          }
        } else {
          // If onboarding is not complete, only allow access to onboarding routes
          if (!isOnboardingRoute) {
            navigate('/onboarding/creator', { replace: true });
          } else {
            setHasAccess(true);
          }
        }

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error checking access:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [navigate, location.pathname, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nino-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;