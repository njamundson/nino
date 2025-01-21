import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useSignInWithEmail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(user));

      // Check if user has completed onboarding
      if (!user.onboardingCompleted) {
        navigate('/onboarding');
        toast({
          title: "Welcome!",
          description: "Please complete your profile setup.",
        });
        return;
      }

      // Navigate based on user type
      if (user.type === 'brand') {
        navigate('/brand/dashboard');
      } else if (user.type === 'creator') {
        navigate('/creator/dashboard');
      } else {
        navigate('/onboarding');
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
  };
};