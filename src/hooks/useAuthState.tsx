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
        if (error.message.includes('Failed to fetch')) {
          console.log('Network error during session check, retrying...');
          // Retry after a short delay
          setTimeout(checkSession, 1000);
          return;
        }
        
        throw error;
      }

      if (!session) {
        console.log('No active session found during initialization');
        navigate('/');
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Session check error:', error);
      setIsError(true);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (!mounted) return;

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
        setIsInitialized(true);
      }
    });

    // Initial session check
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isInitialized, isError };
};