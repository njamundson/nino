import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedCreatorRouteProps {
  children?: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/', { replace: true });
          return;
        }

        // Check if user has a creator profile
        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (creator) {
          setHasAccess(true);
          navigate('/creator/dashboard', { replace: true });
        } else {
          setHasAccess(true); // Allow access to onboarding
        }
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [navigate]);

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