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
      // This will be replaced with Supabase auth.signInWithPassword
      console.log('Preparing for Supabase auth:', { email });
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users from localStorage (temporary until Supabase)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Store auth state (will be handled by Supabase)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('userType', user.type || 'brand');

      return user;
    } catch (error) {
      console.error("Authentication error:", error);
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