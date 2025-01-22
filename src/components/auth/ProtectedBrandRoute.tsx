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
          navigate('/');
          return;
        }

        // Check if user has a brand profile
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (brand) {
          setHasAccess(true);
          // Only redirect to dashboard if we're on the onboarding route
          if (location.pathname.includes('/onboarding')) {
            navigate('/brand/dashboard', { replace: true });
          }
        } else if (location.pathname.includes('/onboarding')) {
          setHasAccess(true); // Allow access to onboarding
        } else {
          navigate('/onboarding/brand', { replace: true });
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

export default ProtectedBrandRoute;