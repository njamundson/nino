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

      if (!signInData.user) {
        throw new Error("No user data returned");
      }

      // Set session immediately after successful sign in
      if (signInData.session) {
        await supabase.auth.setSession({
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
        });
      }

      // Check user profile type and redirect accordingly
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', signInData.user.id)
        .maybeSingle();

      if (brand) {
        navigate('/brand/dashboard');
      } else {
        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', signInData.user.id)
          .maybeSingle();

        if (creator) {
          navigate('/creator/dashboard');
        } else {
          navigate('/onboarding');
        }
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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