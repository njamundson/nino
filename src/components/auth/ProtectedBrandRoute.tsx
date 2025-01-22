import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          await supabase.auth.signOut(); // Clear any invalid session data
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        if (!session) {
          console.log('No session found');
          navigate('/', { replace: true });
          return;
        }

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_OUT' || !session) {
            navigate('/', { replace: true });
            return;
          }

          if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
        });

        // Check if user has a brand profile
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id, onboarding_completed')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error fetching brand profile:', brandError);
          toast({
            title: "Error",
            description: "Could not verify brand access. Please try again.",
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        const isOnboardingRoute = location.pathname.includes('/onboarding');
        const isWelcomeRoute = location.pathname === '/onboarding/brand/payment';

        if (!brand) {
          console.log('No brand profile found');
          navigate('/', { replace: true });
          return;
        }

        if (brand.onboarding_completed) {
          if (isOnboardingRoute && !isWelcomeRoute) {
            navigate('/brand/dashboard', { replace: true });
          } else {
            setHasAccess(true);
          }
        } else {
          if (!isOnboardingRoute) {
            navigate('/onboarding/brand', { replace: true });
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

export default ProtectedBrandRoute;