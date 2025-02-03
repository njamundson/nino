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
      
      console.log("Starting signup process for:", email);

      // Sign up the user directly without checking existing account
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
        console.error('Signup error:', signUpError);
        
        // Handle specific error cases
        if (signUpError.message.includes("already registered")) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "Please sign in instead.",
          });
          onToggleAuth();
          return;
        }
        
        throw signUpError;
      }

      if (authData.user) {
        console.log("User created successfully, creating profile...");
        
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: data.firstName || 'Anonymous',
            last_name: data.lastName || '',
            display_name: `${data.firstName || 'Anonymous'} ${data.lastName || ''}`.trim()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        // Create user type specific profile
        if (userType === 'brand') {
          const { error: brandError } = await supabase
            .from('brands')
            .insert({
              user_id: authData.user.id,
              first_name: data.firstName || 'Anonymous',
              last_name: data.lastName || '',
            });

          if (brandError) {
            console.error('Brand profile creation error:', brandError);
            throw brandError;
          }
          
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

          if (creatorError) {
            console.error('Creator profile creation error:', creatorError);
            throw creatorError;
          }
          
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
        description: "Please try again. If the problem persists, contact support.",
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