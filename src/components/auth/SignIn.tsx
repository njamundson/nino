import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import SignInForm from "./signin/SignInForm";
import SignInHeader from "./signin/SignInHeader";
import { useSignInWithEmail } from "@/hooks/useSignInWithEmail";
import { useToast } from "@/hooks/use-toast";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { loading, signIn } = useSignInWithEmail();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    try {
      // This will be replaced with Supabase auth
      console.log('Preparing for Supabase auth integration');
      await signIn(email, password);
      
      // After successful auth, we'll fetch the user profile from Supabase
      // and determine the correct route based on user type
      const mockUserType = localStorage.getItem('userType') || 'brand';
      const route = mockUserType === 'brand' ? '/brand/dashboard' : '/creator/dashboard';
      
      // Check if onboarding is completed (will be handled by Supabase query)
      const isOnboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      
      if (!isOnboardingCompleted) {
        navigate('/onboarding');
        return;
      }
      
      navigate(route);
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: "Please check your credentials and try again.",
      });
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