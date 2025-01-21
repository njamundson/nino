import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      // Get the current user
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
      
      // Navigate to welcome page first
      navigate('/creator/welcome');
      
      // After 3 seconds, navigate to dashboard
      setTimeout(() => {
        navigate('/creator/dashboard');
      }, 3000);

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

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Whoo whoo!</h1>
        <p className="text-nino-gray text-sm">You're all set—welcome to Nino!</p>
      </div>

      <Button 
        className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
        onClick={handleComplete}
      >
        Dashboard
      </Button>
    </div>
  );
};

export default PaymentStep;