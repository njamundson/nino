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
      console.log("Starting sign up process with data:", { email, firstName, lastName });
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        console.error("Sign in error:", signUpError);
        let errorMessage = "Error creating account";
        
        if (signUpError.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
          onToggleAuth();
        } else {
          switch (signUpError.message) {
            case "Failed to fetch":
              errorMessage = "Network error. Please check your connection and try again.";
              break;
            case "Invalid email":
              errorMessage = "Please enter a valid email address.";
              break;
            case "Weak password":
              errorMessage = "Password is too weak. Please use a stronger password.";
              break;
            default:
              errorMessage = signUpError.message;
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (signUpData?.user) {
        console.log("User signed up successfully");
        
        toast({
          title: "Welcome to NINO",
          description: "Your account has been created successfully.",
        });
        
        // For new signups, always redirect to onboarding
        navigate("/onboarding");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "Error creating account";
      
      if (error.message?.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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