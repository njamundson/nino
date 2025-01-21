import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isCreator = location.pathname.includes('/creator');

  useEffect(() => {
    const createUserAccount = async () => {
      try {
        // Get the pending signup data
        const pendingSignupData = sessionStorage.getItem('pendingSignup');
        if (!pendingSignupData) {
          console.error('No pending signup data found');
          navigate('/');
          return;
        }

        const { email, password, firstName, lastName } = JSON.parse(pendingSignupData);

        // Create the auth user with onboarding completed flag
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              onboarding_completed: true
            }
          }
        });

        if (signUpError) throw signUpError;

        if (!signUpData.user) {
          throw new Error('Failed to create user account');
        }

        // Clear the pending signup data
        sessionStorage.removeItem('pendingSignup');

        // After 3 seconds, navigate to the appropriate dashboard
        setTimeout(() => {
          navigate(isCreator ? "/creator/dashboard" : "/brand/dashboard");
        }, 3000);

      } catch (error: any) {
        console.error('Error creating user account:', error);
        toast({
          title: "Error",
          description: "There was a problem creating your account. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    createUserAccount();
  }, [navigate, isCreator, toast]);

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-6xl font-medium text-nino-primary"
        style={{ fontFamily: "'SF Pro Display', sans-serif" }}
      >
        Welcome to Nino
      </motion.h1>
    </div>
  );
};

export default Welcome;