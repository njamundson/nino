import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const checkCreatorProfile = useCallback(async (userId: string) => {
    try {
      console.log("Checking creator profile for user:", userId);
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id, onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        return { isAuth: true, onboarding: false };
      }

      if (!creator) {
        // No creator profile found - they need to complete onboarding
        console.log('No creator profile found');
        return { isAuth: true, onboarding: false };
      }

      console.log("Creator profile found:", creator);
      return { 
        isAuth: true, 
        onboarding: creator.onboarding_completed || false 
      };
    } catch (error) {
      console.error('Error in checkCreatorProfile:', error);
      return { isAuth: true, onboarding: false };
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      console.log("Checking authentication status...");
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error checking auth status:', error);
        return { isAuth: false, onboarding: false };
      }

      if (!session) {
        console.log('No session found');
        return { isAuth: false, onboarding: false };
      }

      console.log("Session found, checking creator profile...");
      return await checkCreatorProfile(session.user.id);
    } catch (error) {
      console.error('Error in checkAuth:', error);
      return { isAuth: false, onboarding: false };
    }
  }, [checkCreatorProfile]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { isAuth, onboarding } = await checkAuth();
        setIsAuthenticated(isAuth);
        setOnboardingCompleted(onboarding);
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        setIsAuthenticated(false);
        setOnboardingCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
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
      subscription.unsubscribe();
    };
  }, [checkAuth, checkCreatorProfile]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center min-h-[50vh]"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/creator/welcome" replace />;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center min-h-[50vh]"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;