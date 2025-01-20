import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthState = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (error.message.includes('refresh_token_not_found')) {
          console.log('Refresh token not found, signing out');
          await supabase.auth.signOut();
          localStorage.clear();
          toast({
            title: "Session expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        throw error;
      }

      if (!session) {
        console.log('No active session found during initialization');
        navigate('/');
      }
    } catch (error) {
      console.error('Session check error:', error);
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/');
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        localStorage.clear();
        toast({
          title: "Session ended",
          description: "Please sign in again to continue.",
        });
        navigate('/');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
      } else if (event === 'USER_UPDATED') {
        checkSession();
      }
    });

    // Set initialized after subscription is set up
    if (mounted) {
      setIsInitialized(true);
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isInitialized };
};