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
              onboarding_completed: true // This will trigger profile creation
            }
          }
        });

        if (signUpError) throw signUpError;

        if (!signUpData.user) {
          throw new Error('Failed to create user account');
        }

        // Clear the pending signup data
        sessionStorage.removeItem('pendingSignup');

        // After 2 seconds, navigate to the appropriate dashboard
        setTimeout(() => {
          navigate(isCreator ? "/creator/dashboard" : "/brand/dashboard");
        }, 2000);

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
    <div className="fixed inset-0 bg-[#F9F6F2] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <img 
          src="/lovable-uploads/a41591bd-96c0-4f9d-a959-fb8268eabd91.png" 
          alt="Nino Logo" 
          className="w-64 h-auto"
        />
      </motion.div>
    </div>
  );
};

export default Welcome;