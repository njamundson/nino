import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkBrandAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setHasAccess(false);
            setIsLoading(false);
          }
          return false;
        }

        if (!session) {
          console.log("No session found");
          if (mounted) {
            setHasAccess(false);
            setIsLoading(false);
          }
          return false;
        }

        const { data: brands, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (brandError) {
          console.error("Error checking brand profile:", brandError);
          throw brandError;
        }

        if (!brands) {
          console.log("No brand profile found");
          if (mounted) {
            setHasAccess(false);
            setIsLoading(false);
          }
          return false;
        }

        if (mounted) {
          setHasAccess(true);
          setIsLoading(false);
        }
        return true;
      } catch (error) {
        console.error("Error in checkBrandAccess:", error);
        if (mounted) {
          setIsLoading(false);
          setHasAccess(false);
        }
        return false;
      }
    };

    checkBrandAccess();

    const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setHasAccess(false);
          setIsLoading(false);
        }
        navigate('/', { replace: true });
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const hasAccess = await checkBrandAccess();
        if (!hasAccess) {
          toast({
            title: "Access denied",
            description: "You need a brand profile to access this area.",
            variant: "destructive",
          });
          navigate('/onboarding', { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isLoading, hasAccess };
};