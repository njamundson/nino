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
    let mounted = true;
    let subscription: { data: { subscription: any } };

    const checkAccess = async () => {
      try {
        // First, check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error('Session error or no session:', sessionError);
          await supabase.auth.signOut();
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_OUT' || !session) {
            if (mounted) {
              setHasAccess(false);
              setIsLoading(false);
            }
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
          console.error('Error checking brand profile:', brandError);
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
          // Create a new brand profile
          const { error: createError } = await supabase
            .from('brands')
            .insert({
              user_id: session.user.id,
              onboarding_completed: false
            });

          if (createError) {
            console.error('Error creating brand profile:', createError);
            toast({
              title: "Error",
              description: "Could not create brand profile. Please try again.",
              variant: "destructive",
            });
            navigate('/', { replace: true });
            return;
          }

          navigate('/onboarding/brand', { replace: true });
          return;
        }

        if (brand.onboarding_completed) {
          if (isOnboardingRoute && !isWelcomeRoute) {
            navigate('/brand/dashboard', { replace: true });
          } else {
            if (mounted) setHasAccess(true);
          }
        } else {
          if (!isOnboardingRoute) {
            navigate('/onboarding/brand', { replace: true });
          } else {
            if (mounted) setHasAccess(true);
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
        if (mounted) setIsLoading(false);
      }
    };

    checkAccess();

    return () => {
      mounted = false;
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