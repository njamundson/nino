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
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        let errorMessage = "Error creating account";
        
        switch (signUpError.message) {
          case "User already registered":
            errorMessage = "An account with this email already exists. Please sign in instead.";
            onToggleAuth();
            break;
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
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Sign up response:", signUpData);

      if (signUpData?.user) {
        console.log("User created successfully:", signUpData.user);
        
        // Check if email confirmation is required
        if (signUpData.session) {
          console.log("Session available, redirecting to onboarding...");
          toast({
            title: "Welcome to NINO",
            description: "Your account has been created successfully.",
          });
          navigate("/onboarding");
        } else {
          console.log("Email confirmation required");
          toast({
            title: "Check your email",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
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