import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/', { replace: true });
          return;
        }

        // Check if user has a brand profile
        const { data: brand } = await supabase
          .from('brands')
          .select('id, company_name')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const isOnboardingRoute = location.pathname.includes('/onboarding');
        const isWelcomeRoute = location.pathname === '/onboarding/brand/payment';

        if (!brand) {
          navigate('/', { replace: true });
          return;
        }

        if (brand.company_name) {
          // If onboarding is complete
          if (isOnboardingRoute && !isWelcomeRoute) {
            // Redirect to welcome page if coming from onboarding
            navigate('/onboarding/brand/payment', { replace: true });
          } else if (isWelcomeRoute) {
            setHasAccess(true);
          } else {
            // For dashboard routes
            setHasAccess(true);
          }
        } else {
          // If onboarding is not complete, only allow access to onboarding routes
          if (!isOnboardingRoute) {
            navigate('/onboarding/brand', { replace: true });
          } else {
            setHasAccess(true);
          }
        }
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/', { replace: true });
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

export default ProtectedBrandRoute;