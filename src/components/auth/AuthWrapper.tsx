import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isInitialized, isError } = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }

        if (!session && location.pathname !== '/') {
          navigate('/', { replace: true });
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
          toast({
            title: "Session ended",
            description: "Please sign in again to continue.",
          });
        }
        return;
      }

      if (event === 'SIGNED_IN' && mounted) {
        setIsLoading(false);
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

  if (isError) {
    toast({
      title: "Authentication Error",
      description: "There was a problem with your session. Please try logging in again.",
      variant: "destructive",
    });
    navigate('/', { replace: true });
    return null;
  }

  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;