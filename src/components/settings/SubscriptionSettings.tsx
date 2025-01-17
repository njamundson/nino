import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "@/utils/stripe";
import { useToast } from "@/hooks/use-toast";

const SubscriptionSettings = () => {
  const { data: subscriptionData, isLoading } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    try {
      if (!subscriptionData?.subscribed) {
        const checkoutUrl = await createCheckoutSession();
        window.location.href = checkoutUrl;
      } else {
        // TODO: Implement customer portal for subscription management
        toast({
          title: "Coming Soon",
          description: "Subscription management will be available soon.",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to manage subscription. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-nino-text">Subscription</h3>
        <p className="text-sm text-nino-gray">
          {subscriptionData?.subscribed 
            ? "You are currently subscribed to Nino Pro" 
            : "Subscribe to Nino Pro to unlock all features"}
        </p>
      </div>

      <div className="p-4 bg-nino-bg rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">
              {subscriptionData?.subscribed ? "Active Subscription" : "Nino Pro"}
            </h4>
            <p className="text-sm text-nino-gray">
              {subscriptionData?.subscribed 
                ? "Your subscription is active" 
                : "Get access to all features"}
            </p>
          </div>
          <Button 
            onClick={handleManageSubscription}
            className="bg-nino-primary hover:bg-nino-primary/90"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {subscriptionData?.subscribed ? "Manage Subscription" : "Subscribe Now"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionSettings;