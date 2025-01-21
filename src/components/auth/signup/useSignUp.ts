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
      // Store user data in localStorage
      const userData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        onboardingCompleted: false
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      toast({
        title: "Account created",
        description: "Let's complete your profile",
      });

      // Navigate to onboarding
      navigate("/onboarding");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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