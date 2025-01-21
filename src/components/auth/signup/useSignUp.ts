import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define the type locally since we removed the external types
export interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    
    try {
      console.log("Starting sign up process...");
      
      // Store signup data in session storage for onboarding
      const signupData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
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