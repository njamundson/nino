import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "./signup/SignUpForm";
import SignUpHeader from "./signup/SignUpHeader";
import { useToast } from "@/hooks/use-toast";

interface SignUpProps {
  onToggleAuth: () => void;
}

const SignUp = ({ onToggleAuth }: SignUpProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (data: any) => {
    try {
      setLoading(true);
      const { email, password, userType, firstName, lastName } = data;

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create initial profile based on user type
        if (userType === 'brand') {
          const { error: brandError } = await supabase
            .from('brands')
            .insert({
              user_id: authData.user.id,
            });

          if (brandError) throw brandError;
          
          // Directly navigate to brand dashboard
          navigate('/brand/dashboard', { replace: true });
        } else {
          const { error: creatorError } = await supabase
            .from('creators')
            .insert({
              user_id: authData.user.id,
            });

          if (creatorError) throw creatorError;
          
          // Directly navigate to creator dashboard
          navigate('/creator/dashboard', { replace: true });
        }

        toast({
          title: "Account created successfully",
          description: "Welcome to your dashboard!",
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SignUpHeader 
        title="Create account" 
        subtitle="Sign up to get started" 
      />

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