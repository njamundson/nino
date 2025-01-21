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
      // First, create the auth user
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
      if (!authData.user) throw new Error('No user data returned');

      // Profile will be created automatically by the database trigger
      console.log('User created successfully:', authData.user.id);

      toast({
        title: "Account created",
        description: "Please complete your profile setup.",
      });

      return authData;
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Please try again.",
      });
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