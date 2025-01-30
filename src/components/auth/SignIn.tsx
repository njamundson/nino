import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ResetPassword from "./ResetPassword";
import SignInForm from "./signin/SignInForm";
import SignInHeader from "./signin/SignInHeader";
import { useToast } from "@/hooks/use-toast";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter both email and password.",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message === "Invalid login credentials" 
            ? "Invalid email or password. Please try again."
            : "An error occurred during sign in. Please try again.",
        });
        return;
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      console.log("User authenticated, checking brand profile first...");
      
      // First check for brand profile since we want to prioritize brand login
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id, onboarding_completed')
        .eq('user_id', data.user.id)
        .single();

      if (brandError && brandError.code !== 'PGRST116') {
        console.error('Error fetching brand profile:', brandError);
        throw brandError;
      }

      // If brand profile exists, handle brand routing
      if (brand) {
        console.log("Brand profile found:", brand);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        // Use setTimeout to ensure state updates are complete before navigation
        setTimeout(() => {
          if (brand.onboarding_completed) {
            navigate('/brand/dashboard', { replace: true });
          } else {
            navigate('/onboarding/brand', { replace: true });
          }
        }, 100);
        
        return;
      }

      console.log("No brand profile found, checking creator profile...");

      // Only check for creator profile if no brand profile exists
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id, onboarding_completed')
        .eq('user_id', data.user.id)
        .single();

      if (creatorError && creatorError.code !== 'PGRST116') {
        console.error('Error fetching creator profile:', creatorError);
        throw creatorError;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Use setTimeout to ensure state updates are complete before navigation
      setTimeout(() => {
        if (creator) {
          console.log("Creator profile found:", creator);
          if (creator.onboarding_completed) {
            navigate('/creator/dashboard', { replace: true });
          } else {
            navigate('/onboarding/creator', { replace: true });
          }
        } else {
          console.log("No profile found, redirecting to onboarding");
          navigate('/onboarding', { replace: true });
        }
      }, 100);

    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: "An unexpected error occurred. Please try again.",
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
          className="text-sm text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
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
          className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
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