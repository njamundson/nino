import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkCreatorProfile = useCallback(async (userId: string) => {
    try {
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id, onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        return { isAuth: true, onboarding: false };
      }

      return { 
        isAuth: true, 
        onboarding: creator?.onboarding_completed || false 
      };
    } catch (error) {
      console.error('Error in checkCreatorProfile:', error);
      return { isAuth: true, onboarding: false };
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { isAuth: false, onboarding: false };
      }

      return await checkCreatorProfile(session.user.id);
    } catch (error) {
      console.error('Error in checkAuth:', error);
      return { isAuth: false, onboarding: false };
    }
  }, [checkCreatorProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { isAuth, onboarding } = await checkAuth();
      
      if (mounted) {
        setIsAuthenticated(isAuth);
        setOnboardingCompleted(onboarding);
        setIsChecking(false);
      }
    };

    void initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setOnboardingCompleted(false);
      } else if (event === 'SIGNED_IN' && session) {
        const { isAuth, onboarding } = await checkCreatorProfile(session.user.id);
        setIsAuthenticated(isAuth);
        setOnboardingCompleted(onboarding);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAuth, checkCreatorProfile]);

  if (isChecking) {
    return (
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.9 }}
        transition={{ duration: 0.15 }}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/creator/welcome" replace />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;