import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";

const PaymentStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading: isCheckingSubscription } = useSubscription();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to continue.",
        });
        navigate("/");
        return;
      }

      // If already subscribed, redirect to welcome page
      if (subscriptionData?.subscribed) {
        toast({
          title: "Already subscribed",
          description: "You are already subscribed to Nino Pro. Redirecting to welcome page.",
        });
        navigate("/welcome");
        return;
      }

      // Make the request to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { returnUrl: window.location.origin },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        // Handle the specific "already subscribed" error
        if (error.message.includes("Already subscribed")) {
          toast({
            title: "Already subscribed",
            description: "You are already subscribed to Nino Pro. Redirecting to welcome page.",
          });
          navigate("/welcome");
          return;
        }
        throw new Error(error.message);
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
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

  // If already subscribed, show message and redirect
  if (subscriptionData?.subscribed) {
    navigate("/welcome");
    return null;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Join Nino Today!</h1>
      </div>

      <div className="bg-nino-bg rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-nino-text">Nino Pro</h3>
            <p className="text-sm text-nino-gray">Monthly subscription</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-nino-text">$25</div>
            <div className="text-sm text-nino-gray">/month</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Access to All Nino Jobs</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Unlimited Collaborations</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Direct Messaging with Brands</span>
          </div>
        </div>
      </div>

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