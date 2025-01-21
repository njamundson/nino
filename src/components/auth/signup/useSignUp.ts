import { useState } from "react";
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
      // This will be replaced with Supabase auth.signUp
      console.log('Preparing for Supabase auth signup');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (existingUsers.some((user: any) => user.email === data.email)) {
        throw new Error('Email already in use');
      }

      // Create new user (this will be handled by Supabase)
      const newUser = {
        id: crypto.randomUUID(),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
      };

      // Add to users array (temporary until Supabase)
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Set current user (will be handled by Supabase session)
      localStorage.setItem('userData', JSON.stringify(newUser));

      // Show success message
      toast({
        title: "Account created",
        description: "Please complete your profile setup.",
      });

      return newUser;
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