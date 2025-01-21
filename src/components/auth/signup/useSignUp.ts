import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useSignUp = (onToggleAuth: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async ({ email, password, firstName, lastName }: SignUpFormData) => {
    setLoading(true);
    
    try {
      console.log("Starting sign up process...");
      
      // Create the auth user with onboarding flag set to false
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            onboarding_completed: false
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error('No user data returned');
      }

      // Store signup data in session storage for onboarding
      const signupData = {
        email,
        password,
        firstName,
        lastName
      };
      
      // Save signup data to session storage (will be used during onboarding)
      sessionStorage.setItem('pendingSignup', JSON.stringify(signupData));
      
      console.log("Redirecting to onboarding...");
      toast({
        title: "Let's set up your account",
        description: "Please complete the onboarding process to create your account.",
      });
      
      // Navigate to onboarding selection page
      navigate("/onboarding");
      
    } catch (error: any) {
      console.error("Unexpected error during sign up process:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignUp,
  };
};