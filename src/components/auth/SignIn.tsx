import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ResetPassword from "./ResetPassword";
import { AuthError } from "@supabase/supabase-js";
import SignInForm from "./signin/SignInForm";
import SignInHeader from "./signin/SignInHeader";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    if (loading) return;
    
    setLoading(true);
    console.log("Starting sign in process...");
    
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        let errorMessage = "Failed to sign in";
        
        if (signInError instanceof AuthError) {
          switch (signInError.message) {
            case "Invalid login credentials":
              errorMessage = "Invalid email or password. Please try again.";
              break;
            case "Email not confirmed":
              errorMessage = "Please verify your email before signing in.";
              break;
            default:
              errorMessage = signInError.message;
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!signInData.user || !signInData.session) {
        toast({
          title: "Error",
          description: "No user data received. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("User signed in successfully, checking profiles...");

      // Check if user has a brand profile
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', signInData.user.id)
        .maybeSingle();

      if (brandError) {
        console.error("Error fetching brand profile:", brandError);
        throw new Error("Failed to fetch user profile");
      }

      if (brand) {
        console.log("Brand profile found, redirecting to dashboard");
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        navigate('/brand/dashboard', { replace: true });
        return;
      }

      // Check if user has a creator profile
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', signInData.user.id)
        .maybeSingle();

      if (creatorError) {
        console.error("Error fetching creator profile:", creatorError);
        throw new Error("Failed to fetch user profile");
      }

      if (creator) {
        console.log("Creator profile found, redirecting to creator dashboard");
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        navigate('/creator/dashboard', { replace: true });
      } else {
        console.log("No profile found, redirecting to onboarding");
        navigate('/onboarding', { replace: true });
      }

    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SignInHeader 
        title="Welcome back" 
        subtitle="Sign in to continue" 
      />

      <SignInForm 
        onSubmit={handleSignIn}
        loading={loading}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowResetPassword(true)}
          className="text-sm text-nino-primary hover:text-nino-primary/80 transition-colors duration-300 disabled:opacity-50"
          disabled={loading}
        >
          Forgot password?
        </button>
      </div>

      <div className="text-center text-sm text-nino-gray">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggleAuth}
          className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300 disabled:opacity-50"
          disabled={loading}
        >
          Create one
        </button>
      </div>

      <ResetPassword 
        isOpen={showResetPassword} 
        onClose={() => setShowResetPassword(false)} 
      />
    </div>
  );
};

export default SignIn;