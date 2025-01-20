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
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const checkBrandAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message.includes("refresh_token_not_found")) {
            await supabase.auth.signOut();
            toast({
              title: "Session expired",
              description: "Please sign in again to continue.",
              variant: "destructive",
            });
          }
          navigate('/', { replace: true });
          return;
        }

        if (!session) {
          console.log("No session found");
          navigate('/', { replace: true });
          return;
        }

        const userId = session.user?.id;
        if (!userId) {
          console.log("No user ID found in session");
          navigate('/', { replace: true });
          return;
        }

        console.log("Checking brand profile for user:", userId);
        const { data: brands, error: brandError } = await supabase
          .from('brands')
          .select('id, company_name')
          .eq('user_id', userId)
          .maybeSingle();

        if (brandError) {
          console.error("Error checking brand profile:", brandError);
          throw brandError;
        }

        if (!brands) {
          console.log("No brand profile found");
          toast({
            title: "Access denied",
            description: "You need a brand profile to access this area.",
            variant: "destructive",
          });
          navigate('/onboarding', { replace: true });
          return;
        }

        console.log("Brand profile found:", brands);
        if (mounted) {
          setHasAccess(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkBrandAccess:", error);
        if (mounted) {
          setIsLoading(false);
          setHasAccess(false);
        }
        toast({
          title: "Error checking access",
          description: "Please try again later.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    };

    // Set up auth state change listener
    authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session?.user?.id ? "exists" : "none");
      
      if (event === 'SIGNED_OUT' || !session?.user?.id) {
        console.log("User signed out or no valid session");
        if (mounted) {
          setHasAccess(false);
          setIsLoading(false);
        }
        navigate('/', { replace: true });
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkBrandAccess();
      }
    });

    // Initial check
    checkBrandAccess();

    // Cleanup
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nino-bg">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;