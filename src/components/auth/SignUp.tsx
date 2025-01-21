import { useNavigate } from "react-router-dom";
import SignUpForm from "./signup/SignUpForm";
import SignUpHeader from "./signup/SignUpHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SignUpProps {
  onToggleAuth: () => void;
}

const SignUp = ({ onToggleAuth }: SignUpProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (data: any) => {
    try {
      setLoading(true);
      
      // First, create the user account with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            user_type: data.userType,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
            }
          ]);

        if (profileError) throw profileError;

        // Create brand or creator record based on user type
        if (data.userType === 'brand') {
          const { error: brandError } = await supabase
            .from('brands')
            .insert([
              {
                user_id: authData.user.id,
                company_name: '', // Will be filled during onboarding
                brand_type: 'retail', // Default value, will be updated during onboarding
              }
            ]);

          if (brandError) throw brandError;
        } else if (data.userType === 'creator') {
          const { error: creatorError } = await supabase
            .from('creators')
            .insert([
              {
                user_id: authData.user.id,
                creator_type: 'solo', // Default value, will be updated during onboarding
              }
            ]);

          if (creatorError) throw creatorError;
        }

        toast({
          title: "Account created successfully",
          description: "Welcome to NINO!",
        });
        
        // Redirect based on user type
        if (data.userType === 'brand') {
          navigate('/onboarding/brand');
        } else if (data.userType === 'creator') {
          navigate('/onboarding/creator');
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message || "Please try again.",
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
          disabled={loading}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignUp;