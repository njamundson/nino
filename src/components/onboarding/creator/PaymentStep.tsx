import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
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
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to continue.",
        });
        navigate("/");
        return;
      }

      console.log('Creating checkout session with token:', session.access_token);

      // Make the request to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Checkout invoke error:', error);
        throw new Error(error.message || 'Failed to start checkout process');
      }

      if (!data) {
        console.error('No data received from checkout function');
        throw new Error('No response received from checkout process');
      }

      // Redirect to Stripe checkout if URL is received
      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
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