import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useSignUp = (onToggleAuth: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async ({ email, password, firstName, lastName }: SignUpFormData) => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
          });
          onToggleAuth();
          return;
        }

        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      if (signUpData?.user) {
        toast({
          title: "Welcome to NINO",
          description: "Your account has been created successfully.",
        });
        navigate("/onboarding");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignUp,
  };
};