import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useSignUp = (onToggleAuth: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async ({ email, password, firstName, lastName }: SignUpData) => {
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
        
        // Check if the error response contains a JSON body
        try {
          const errorBody = JSON.parse(signUpError.message);
          if (errorBody.code === "user_already_exists") {
            errorMessage = "An account with this email already exists. Please sign in instead.";
            onToggleAuth(); // Switch to sign in form
            return;
          }
        } catch {
          // If parsing fails, handle the error message directly
          if (signUpError.message.includes("User already registered")) {
            errorMessage = "An account with this email already exists. Please sign in instead.";
            onToggleAuth();
            return;
          }
        }
        
        // Handle other types of errors
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
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (signUpData?.session) {
        toast({
          title: "Welcome to NINO",
          description: "Your account has been created successfully.",
        });
        
        navigate("/onboarding");
      } else {
        // If no session but signup was successful, show a message about email confirmation
        toast({
          title: "Check your email",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "Error creating account";
      
      if (error instanceof AuthError) {
        switch (error.message) {
          case "Failed to fetch":
            errorMessage = "Network error. Please check your connection and try again.";
            break;
          case "User already registered":
            errorMessage = "An account with this email already exists.";
            onToggleAuth();
            break;
          default:
            errorMessage = error.message;
        }
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