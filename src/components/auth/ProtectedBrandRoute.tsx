import { useEffect, useState, useCallback } from "react";
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

  const checkBrandAccess = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        console.log("No valid session found");
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/');
        return;
      }

      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id, company_name')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (brandError) {
        throw brandError;
      }

      if (!brand) {
        console.log("No brand profile found");
        setIsAuthenticated(false);
        setIsLoading(false);
        toast({
          title: "Access denied",
          description: "You need a brand profile to access this area.",
          variant: "destructive",
        });
        navigate('/onboarding');
        return;
      }

      console.log("Brand profile found:", brand);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in checkBrandAccess:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to verify access. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate, toast]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (mounted) {
        await checkBrandAccess();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event, "Session:", session?.user?.id ? "exists" : "none");
      
      if (event === 'SIGNED_OUT' || !session?.user?.id) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/');
        return;
      }

      if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        checkBrandAccess();
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkBrandAccess, navigate]);

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