import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          toast({
            title: "Authentication Error",
            description: "There was a problem fetching your session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setAuthState({
          session,
          user: session?.user ?? null,
          loading: false,
        });
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      
      setAuthState({
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return authState;
};