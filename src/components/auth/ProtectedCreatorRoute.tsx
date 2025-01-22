import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/');
          return;
        }

        // Check if user has a creator profile
        const { data: creator } = await supabase
          .from('creators')
          .select('id, bio')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const isOnboardingRoute = location.pathname.includes('/onboarding');
        const isWelcomeRoute = location.pathname === '/onboarding/creator/welcome';

        if (!creator) {
          navigate('/');
          return;
        }

        if (creator.bio) {
          // If onboarding is complete, allow access to dashboard or welcome screen
          if (isOnboardingRoute && !isWelcomeRoute) {
            navigate('/creator/dashboard');
          } else {
            setHasAccess(true);
          }
        } else {
          // If onboarding is not complete, only allow access to onboarding routes
          if (!isOnboardingRoute) {
            navigate('/onboarding/creator');
          } else {
            setHasAccess(true);
          }
        }
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [navigate, location.pathname]);

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