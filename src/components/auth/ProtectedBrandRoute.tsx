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
    const checkBrandAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          console.log("No active session found");
          toast({
            title: "Access denied",
            description: "Please sign in to continue.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        console.log("Checking brand profile for user:", session.user.id);

        // Check if user has a brand profile
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('*')
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
        setIsLoading(false);

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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/');
      }
    });

    checkBrandAccess();

    return () => {
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