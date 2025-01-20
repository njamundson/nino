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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkBrandAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          navigate('/');
          return;
        }

        if (!session) {
          console.log("No session found");
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          navigate('/');
          return;
        }

        const userId = session.user?.id;
        if (!userId) {
          console.log("No user ID found in session");
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          navigate('/');
          return;
        }

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id, company_name')
          .eq('user_id', userId)
          .maybeSingle();

        if (brandError) {
          console.error("Error checking brand profile:", brandError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          navigate('/');
          return;
        }

        if (!brand) {
          console.log("No brand profile found");
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
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
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkBrandAccess:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        navigate('/');
      }
    };

    // Initial check
    checkBrandAccess();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event, "Session:", session?.user?.id ? "exists" : "none");
      
      if (event === 'SIGNED_OUT' || !session?.user?.id) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/');
        return;
      }

      // Only recheck access on specific events
      if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        checkBrandAccess();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;