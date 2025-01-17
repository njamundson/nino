import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { createCheckoutSession } from "@/utils/stripe";
import PricingCard from "./payment/PricingCard";

const PaymentStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading: isCheckingSubscription } = useSubscription();

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

      const checkoutUrl = await createCheckoutSession();
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