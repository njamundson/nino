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

  useEffect(() => {
    let mounted = true;

    const checkBrandAccess = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Failed to get session");
        }

        if (!session?.user?.id) {
          console.log("No active session found");
          throw new Error("No active session");
        }

        console.log("Checking brand profile for user:", session.user.id);
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', session.user.id)
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
          title: "Access denied",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (!session?.user?.id || event === 'SIGNED_OUT') {
        console.log("No session or signed out");
        navigate('/');
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkBrandAccess();
      }
    });

    // Initial check
    checkBrandAccess();

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

  return <>{children}</>;
};

export default ProtectedBrandRoute;