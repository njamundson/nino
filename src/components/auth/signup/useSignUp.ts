import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (data: SignUpFormData) => {
    if (loading) return null;
    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Account created",
        description: "Please complete your profile setup.",
      });

      return authData;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignUp,
  };
};