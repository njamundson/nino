import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    if (loading) return;
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (error) throw error;

      // Note: The profile will be created automatically by the database trigger
      // The brand/creator profile will be created after onboarding

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