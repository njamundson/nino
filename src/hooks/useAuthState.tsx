import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthState = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        if (error.message.includes('Failed to fetch')) {
          console.log('Network error during session check, retrying...');
          setTimeout(checkSession, 2000); // Retry after 2 seconds
          return;
        }
        
        throw error;
      }

      if (!session) {
        console.log('No active session found');
        localStorage.clear();
        navigate('/');
        return;
      }

      // Verify the session is valid by making a test request
      const { error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();

      if (testError && testError.code === 'PGRST301') {
        console.log('Invalid session detected');
        await supabase.auth.signOut();
        localStorage.clear();
        navigate('/');
        return;
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Session check error:', error);
      setIsError(true);
      setIsInitialized(true);
      localStorage.clear();
      navigate('/');
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAuth = async () => {
      try {
        await checkSession();
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying session check (${retryCount}/${maxRetries})...`);
          setTimeout(initializeAuth, Math.pow(2, retryCount) * 1000);
        } else {
          console.error('Max retries reached for session check');
          if (mounted) {
            setIsError(true);
            setIsInitialized(true);
          }
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log('User signed out or no session');
        localStorage.clear();
        toast({
          title: "Session ended",
          description: "Please sign in again to continue.",
        });
        navigate('/');
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in');
        setIsInitialized(true);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isInitialized, isError };
};