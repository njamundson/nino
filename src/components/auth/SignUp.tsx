import { useNavigate } from "react-router-dom";
import { useSignUp } from "./signup/useSignUp";
import SignUpForm from "./signup/SignUpForm";
import SignUpHeader from "./signup/SignUpHeader";
import { useToast } from "@/hooks/use-toast";

interface SignUpProps {
  onToggleAuth: () => void;
}

const SignUp = ({ onToggleAuth }: SignUpProps) => {
  const navigate = useNavigate();
  const { loading, handleSignUp } = useSignUp();
  const { toast } = useToast();

  const onSignUp = async (data: any) => {
    try {
      console.log('Preparing for Supabase auth signup:', { email: data.email });
      const result = await handleSignUp(data);
      
      if (result) {
        console.log('User signed up, preparing for profile creation');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SignUpHeader 
        title="Create account" 
        subtitle="Sign up to get started" 
      />

      <SignUpForm onSubmit={onSignUp} loading={loading} />

      <div className="text-center text-sm text-nino-gray">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggleAuth}
          className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
          disabled={loading}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignUp;