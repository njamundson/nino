import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const setupCreator = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user found");

        // Get the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Profile not found");

        // Check if creator profile exists
        const { data: existingCreator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) throw creatorError;

        // Create creator profile if it doesn't exist
        if (!existingCreator) {
          const { error: insertError } = await supabase
            .from('creators')
            .insert({
              user_id: user.id,
              profile_id: profile.id,
            });

          if (insertError) throw insertError;
        }
        
        // Navigate directly to welcome page
        navigate('/creator/welcome', { replace: true });
        
        toast({
          title: "Welcome to Nino!",
          description: "Your creator account has been set up successfully.",
        });
      } catch (error) {
        console.error('Error setting up creator account:', error);
        toast({
          variant: "destructive",
          title: "Setup Error",
          description: "There was a problem setting up your creator account. Please try again.",
        });
        navigate('/onboarding');
      }
    };

    setupCreator();
  }, [navigate, toast]);

  // Return null to prevent any flickering during transition
  return null;
};

export default PaymentStep;