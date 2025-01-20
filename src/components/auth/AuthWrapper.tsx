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
    console.log("AuthWrapper mounted, checking session...");

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (mounted) {
            toast({
              title: "Authentication Error",
              description: "There was a problem checking your session. Please try logging in again.",
              variant: "destructive",
            });
            navigate('/');
          }
          return;
        }

        if (!session) {
          console.log("No active session, redirecting to login");
          if (mounted) {
            navigate('/');
          }
          return;
        }

        console.log("Valid session found for user:", session.user.id);
        
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event, "Session:", session?.user?.id ? "exists" : "none");
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session expired");
        navigate('/');
        return;
      }

      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log("Session token refreshed successfully");
      }
    });

    initAuth();

    return () => {
      console.log("AuthWrapper unmounting, cleaning up...");
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