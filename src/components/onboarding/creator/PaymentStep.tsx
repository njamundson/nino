import { Button } from "@/components/ui/button";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PaymentStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      console.log("Starting subscription process...");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to continue.",
        });
        navigate("/");
        return;
      }

      console.log("Creating checkout session...");
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log("Checkout response:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start checkout process",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Choose Your Plan</h1>
        <p className="text-nino-gray text-sm">Get started with Nino today</p>
      </div>

      <div className="bg-nino-bg rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-nino-text">Nino Pro</h3>
            <p className="text-sm text-nino-gray">Monthly subscription</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-nino-text">$10</div>
            <div className="text-sm text-nino-gray">/month</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Access to all Nino features</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Priority support</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Analytics dashboard</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nino-text">
            <Check className="w-4 h-4 text-nino-primary" />
            <span>Unlimited collaborations</span>
          </div>
        </div>
      </div>

      <Button 
        className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Subscribe Now
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentStep;