import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const useSignInWithEmail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

      if (!signInData.user) {
        throw new Error("No user data returned");
      }

      console.log("Successfully signed in, checking profile status...");

      const { data: profileStatus, error: profileError } = await supabase
        .rpc('check_user_profile_status', {
          user_uuid: signInData.user.id
        });

      if (profileError) {
        console.error("Error checking profile status:", profileError);
        throw profileError;
      }

      console.log("Profile status:", profileStatus);

      // If user has no profile at all, send to onboarding
      if (!profileStatus.has_brand && !profileStatus.has_creator) {
        console.log("No profile found, redirecting to onboarding...");
        navigate('/onboarding');
        toast({
          title: "Welcome!",
          description: "Please complete your profile setup.",
        });
        return;
      }

      // If user has a brand profile, send to brand dashboard
      if (profileStatus.has_brand) {
        console.log("Brand profile found, redirecting to dashboard...");
        navigate('/brand/dashboard');
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        return;
      }

      // If user has a creator profile, send to creator dashboard
      if (profileStatus.has_creator) {
        console.log("Creator profile found, redirecting to dashboard...");
        navigate('/creator/dashboard');
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        return;
      }

    } catch (error) {
      console.error("Authentication error:", error);
      let errorMessage = "An unexpected error occurred";
      
      if (error instanceof AuthError) {
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "Invalid email or password";
            break;
          case "Email not confirmed":
            errorMessage = "Please verify your email before signing in";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      console.log("Sign in process completed");
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
  };
};