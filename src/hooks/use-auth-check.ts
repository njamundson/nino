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
        setIsLoading(true);
        console.log("Checking brand access...");

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            setHasAccess(false);
            setIsLoading(false);
          }
          return false;
        }

        // Try to refresh the session
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Error refreshing session:", refreshError);
          // If refresh fails, sign out and redirect to sign in
          await supabase.auth.signOut();
          if (mounted) {
            setHasAccess(false);
            setIsLoading(false);
          }
          navigate('/signin', { replace: true });
          return false;
        }

        console.log("Session found:", session);

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

        console.log("Brand profile found:", brands);
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
        toast({
          title: "Authentication Error",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate('/signin', { replace: true });
        return false;
      }
    };

    // Initial check
    checkBrandAccess();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setHasAccess(false);
          setIsLoading(false);
        }
        navigate('/signin', { replace: true });
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
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  return { isLoading, hasAccess };
};