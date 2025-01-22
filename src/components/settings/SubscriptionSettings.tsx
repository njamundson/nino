import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubscriptionSettings = () => {
  const { data: subscriptionData, isLoading } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    toast({
      title: "Coming Soon",
      description: "Subscription management will be available soon.",
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-nino-white rounded-2xl shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-nino-white rounded-2xl p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-nino-text">Subscription</h3>
        <p className="text-sm text-nino-gray">
          {subscriptionData?.subscribed 
            ? "You are currently subscribed to Nino Pro" 
            : "Subscribe to Nino Pro to unlock all features"}
        </p>
      </div>

      <div className="p-4 bg-nino-bg rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-medium text-nino-text">
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
            className="w-full sm:w-auto bg-[#A55549] hover:bg-[#A55549]/90 text-white"
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