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
        let errorMessage = "Failed to sign in";
        
        if (signInError instanceof AuthError) {
          switch (signInError.message) {
            case "Invalid login credentials":
              errorMessage = "Invalid email or password. Please try again.";
              break;
            case "Email not confirmed":
              errorMessage = "Please verify your email before signing in.";
              break;
            default:
              errorMessage = signInError.message;
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!signInData.user) {
        throw new Error("No user data returned");
      }

      console.log("Successfully signed in, checking profile status...");

      // Use our debug function to check profile status
      const { data: profileStatus, error: profileError } = await supabase
        .rpc('check_user_profile_status', {
          user_uuid: signInData.user.id
        });

      if (profileError) {
        console.error("Error checking profile status:", profileError);
        throw profileError;
      }

      console.log("Profile status:", profileStatus);

      // If user has neither profile, send to onboarding
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
    signIn,
  };
};