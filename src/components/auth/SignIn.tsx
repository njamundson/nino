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
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
          });
          return;
        }
        throw error;
      }

      if (data.user) {
        // Fetch user profile to determine type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch user profile. Please try again.",
          });
          return;
        }

        if (profile) {
          // First check if user is a creator
          const { data: creator } = await supabase
            .from('creators')
            .select('id, onboarding_completed')
            .eq('user_id', profile.id)
            .maybeSingle();

          // Then check if user is a brand
          const { data: brand } = await supabase
            .from('brands')
            .select('id, onboarding_completed')
            .eq('user_id', profile.id)
            .maybeSingle();

          if (creator) {
            if (creator.onboarding_completed) {
              navigate('/creator/dashboard', { replace: true });
            } else {
              navigate('/onboarding/creator', { replace: true });
            }
          } else if (brand) {
            if (brand.onboarding_completed) {
              navigate('/brand/dashboard', { replace: true });
            } else {
              navigate('/onboarding/brand', { replace: true });
            }
          } else {
            // If neither, they need to complete onboarding
            navigate('/onboarding', { replace: true });
          }

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
      }
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