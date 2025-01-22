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
    let subscription: { data: { subscription: any } };

    const checkAccess = async () => {
      try {
        // First, check if we have a valid session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        if (!sessionData.session) {
          console.log('No session found');
          navigate('/', { replace: true });
          return;
        }

        // Set up auth state listener
        subscription = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
              navigate('/', { replace: true });
              return;
            }
          }
        );

        // Check if user has a creator profile
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id, onboarding_completed')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error fetching creator profile:', creatorError);
          toast({
            title: "Error",
            description: "Could not verify creator access. Please try again.",
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        // Check if user is trying to access brand routes
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id, onboarding_completed')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error checking brand profile:', brandError);
        }

        // If user has a brand profile, redirect to brand dashboard
        if (brand?.id) {
          console.log('User has a brand profile, redirecting to brand dashboard');
          navigate('/brand/dashboard', { replace: true });
          return;
        }

        const isOnboardingRoute = location.pathname.includes('/onboarding');
        const isWelcomeRoute = location.pathname === '/onboarding/creator/welcome';

        if (!creator) {
          console.log('No creator profile found');
          navigate('/onboarding', { replace: true });
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
      } catch (error) {
        console.error('Error checking access:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();

    return () => {
      if (subscription?.data?.subscription) {
        subscription.data.subscription.unsubscribe();
      }
    };
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