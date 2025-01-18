import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { createCheckoutSession } from "@/utils/stripe";
import { supabase } from "@/integrations/supabase/client";
import PricingCard from "./payment/PricingCard";

const PaymentStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading: isCheckingSubscription } = useSubscription();

  // Check for successful payment on component mount
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (sessionId) {
        try {
          setIsLoading(true);
          
          // Get the current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("No authenticated user found");

          // Get the user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (!profile) throw new Error("Profile not found");

          // Create creator profile if it doesn't exist
          const { data: existingCreator } = await supabase
            .from('creators')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!existingCreator) {
            const { error: creatorError } = await supabase
              .from('creators')
              .insert({
                user_id: user.id,
                profile_id: profile.id,
              });

            if (creatorError) throw creatorError;
          }

          // Clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
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
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkPaymentStatus();
  }, [navigate, toast]);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // If already subscribed, redirect to creator dashboard
      if (subscriptionData?.subscribed) {
        toast({
          title: "Already subscribed",
          description: "You are already subscribed to Nino Pro. Redirecting to dashboard.",
        });
        navigate("/creator/dashboard");
        return;
      }

      const checkoutUrl = await createCheckoutSession({
        returnUrl: `${window.location.origin}/onboarding/creator`,
      });

      if (!checkoutUrl) {
        throw new Error("No checkout URL received");
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Subscription Error",
        description: error instanceof Error ? error.message : "Failed to start checkout process. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If checking subscription status, show loading state
  if (isCheckingSubscription) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse">Loading subscription status...</div>
      </div>
    );
  }

  // If already subscribed, redirect to creator dashboard
  if (subscriptionData?.subscribed) {
    navigate("/creator/dashboard");
    return null;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Join Nino Today!</h1>
      </div>

      <PricingCard />

      <Button 
        className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {isLoading ? "Processing..." : "Subscribe Now"}
      </Button>
    </div>
  );
};

export default PaymentStep;