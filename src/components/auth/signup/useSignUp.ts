import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SignUpFormData } from "@/types/auth";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      
      console.log("Redirecting to onboarding...");
      toast({
        title: "Let's set up your account",
        description: "Please complete the onboarding process.",
      });
      
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