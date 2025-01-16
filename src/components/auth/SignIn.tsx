import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import EmailField from "./form-fields/EmailField";
import PasswordField from "./form-fields/PasswordField";
import SubmitButton from "./form-fields/SubmitButton";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (creatorError && creatorError.code !== 'PGRST116') {
        throw creatorError;
      }

      toast({
        title: "Welcome back!",
      });

      if (creator) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Welcome back</h1>
        <p className="text-nino-gray text-sm">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <EmailField email={email} onChange={setEmail} />
          <PasswordField password={password} onChange={setPassword} />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowResetPassword(true)}
            className="text-sm text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
          >
            Forgot password?
          </button>
        </div>

        <SubmitButton
          loading={loading}
          text="Sign In"
          loadingText="Signing in..."
        />

        <div className="text-center text-sm text-nino-gray">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onToggleAuth}
            className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
          >
            Create one
          </button>
        </div>
      </form>

      <ResetPassword 
        isOpen={showResetPassword} 
        onClose={() => setShowResetPassword(false)} 
      />
    </div>
  );
};

export default SignIn;