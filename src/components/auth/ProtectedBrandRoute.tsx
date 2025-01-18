import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session?.user?.id) {
          console.log("No active session found");
          toast({
            title: "Access denied",
            description: "Please sign in to continue.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log("Auth state changed:", event, currentSession?.user?.id);
          
          if (event === 'SIGNED_OUT' || !currentSession) {
            navigate('/');
            return;
          }

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Recheck brand access
            await checkBrandAccess(currentSession.user.id);
          }
        });

        // Initial brand access check
        await checkBrandAccess(session.user.id);

        if (mounted) {
          setIsInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Initialization error:", error);
        toast({
          title: "Error",
          description: "Failed to initialize. Please try signing in again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    const checkBrandAccess = async (userId: string) => {
      try {
        console.log("Checking brand profile for user:", userId);

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (brandError) {
          console.error("Error checking brand profile:", brandError);
          throw brandError;
        }

        if (!brand) {
          console.log("No brand profile found");
          toast({
            title: "Access denied",
            description: "You need a brand profile to access this area.",
            variant: "destructive",
          });
          navigate('/onboarding');
          return;
        }

        console.log("Brand profile found:", brand);
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkBrandAccess:", error);
        toast({
          title: "Error",
          description: "Failed to verify access. Please try signing in again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [navigate, toast]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;