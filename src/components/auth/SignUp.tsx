import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "./signup/SignUpForm";
import { AuthError } from "@supabase/supabase-js";

interface SignUpProps {
  onToggleAuth: () => void;
}

const SignUp = ({ onToggleAuth }: SignUpProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async ({ email, password, firstName, lastName }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
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
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        let errorMessage = "Error creating account";
        
        if (signUpError.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
          onToggleAuth(); // Switch to sign in form
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

      if (signUpData) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account before signing in.",
        });
        
        // Switch back to sign in view after successful registration
        onToggleAuth();
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
            onToggleAuth(); // Switch to sign in form
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Create account</h1>
        <p className="text-nino-gray text-sm">Sign up to get started</p>
      </div>

      <SignUpForm onSubmit={handleSignUp} loading={loading} />

      <div className="text-center text-sm text-nino-gray">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggleAuth}
          className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignUp;