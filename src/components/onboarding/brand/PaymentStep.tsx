import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      // Get the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      // Create brand profile if it doesn't exist
      const { data: existingBrand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingBrand) {
        const { error: brandError } = await supabase
          .from('brands')
          .insert({
            user_id: user.id,
          });

        if (brandError) throw brandError;
      }
      
      // Navigate to welcome page first
      navigate('/brand/welcome');
      
      // After 3 seconds, navigate to dashboard
      setTimeout(() => {
        navigate('/brand/dashboard');
      }, 3000);

      toast({
        title: "Welcome to Nino!",
        description: "Your brand account has been set up successfully.",
      });
    } catch (error) {
      console.error('Error setting up brand account:', error);
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: "There was a problem setting up your brand account. Please try again.",
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