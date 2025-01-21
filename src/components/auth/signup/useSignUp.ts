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
      
      // Store signup data in session storage for onboarding
      const signupData = {
        email,
        password,
        firstName,
        lastName
      };
      
      // Save signup data to session storage (will be used during onboarding)
      sessionStorage.setItem('pendingSignup', JSON.stringify(signupData));
      
      // Instead of creating the auth user now, we'll redirect to onboarding
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
        description: "An unexpected error occurred. Please try again.",
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