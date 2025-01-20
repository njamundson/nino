import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isInitialized, isError } = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let initialCheck = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (mounted) {
            setIsLoading(false);
            if (initialCheck) {
              toast({
                title: "Authentication Error",
                description: "There was a problem checking your session. Please try logging in again.",
                variant: "destructive",
              });
              navigate('/');
            }
          }
          return;
        }

        if (!session && initialCheck) {
          console.log("No active session, redirecting to login");
          if (mounted) {
            setIsLoading(false);
            navigate('/');
          }
          return;
        }

        if (mounted) {
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      } finally {
        initialCheck = false;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT' || !session) {
        if (window.location.pathname !== '/') {
          navigate('/');
        }
        return;
      }

      if (event === 'SIGNED_IN') {
        setIsLoading(false);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (isError) {
    toast({
      title: "Authentication Error",
      description: "There was a problem with your session. Please try logging in again.",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;