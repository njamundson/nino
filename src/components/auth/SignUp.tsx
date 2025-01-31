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
      const { email, password, userType } = data;
      
      // Log signup data for debugging
      console.log("Signup data:", data);

      // Check if user exists first
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (existingUser?.user) {
        toast({
          variant: "destructive",
          title: "Account already exists",
          description: "Please sign in instead.",
        });
        onToggleAuth(); // Switch to sign in form
        return;
      }

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: data.firstName || 'Anonymous',
            last_name: data.lastName || '',
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "Please sign in instead.",
          });
          onToggleAuth(); // Switch to sign in form
          return;
        }
        throw signUpError;
      }

      if (authData.user) {
        // Create profile first
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: data.firstName || 'Anonymous',
            last_name: data.lastName || '',
            display_name: `${data.firstName || 'Anonymous'} ${data.lastName || ''}`.trim()
          });

        if (profileError) throw profileError;

        // Create initial profile based on user type
        if (userType === 'brand') {
          const { error: brandError } = await supabase
            .from('brands')
            .insert({
              user_id: authData.user.id,
              first_name: data.firstName || 'Anonymous',
              last_name: data.lastName || '',
            });

          if (brandError) throw brandError;
          
          navigate('/onboarding/brand');
        } else {
          const { error: creatorError } = await supabase
            .from('creators')
            .insert({
              user_id: authData.user.id,
              first_name: data.firstName || 'Anonymous',
              last_name: data.lastName || '',
              display_name: `${data.firstName || 'Anonymous'} ${data.lastName || ''}`.trim()
            });

          if (creatorError) throw creatorError;
          
          navigate('/onboarding/creator');
        }

        toast({
          title: "Account created successfully",
          description: "Please complete your profile setup.",
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