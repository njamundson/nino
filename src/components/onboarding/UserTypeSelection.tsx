import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreatorSelection = async () => {
    try {
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

      // Create checkout session directly
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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start checkout process",
      });
    }
  };

  const handleBrandSelection = () => {
    navigate('/onboarding/brand');
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-nino-primary rounded-full" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-nino-text">
            Tell us about yourself
          </h1>
          <p className="text-nino-gray">
            Select your role to personalize your experience
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleCreatorSelection}
            className="w-full bg-white hover:bg-nino-bg border-2 border-transparent hover:border-nino-primary rounded-xl p-6 text-left transition-all duration-200 group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-nino-bg rounded-lg group-hover:bg-white transition-colors">
                <Star className="h-6 w-6 text-nino-primary" />
              </div>
              <div>
                <h3 className="font-medium text-nino-text">Creator</h3>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleBrandSelection}
            className="w-full bg-white hover:bg-nino-bg border-2 border-transparent hover:border-nino-primary rounded-xl p-6 text-left transition-all duration-200 group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-nino-bg rounded-lg group-hover:bg-white transition-colors">
                <Briefcase className="h-6 w-6 text-nino-primary" />
              </div>
              <div>
                <h3 className="font-medium text-nino-text">Brand</h3>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Skip button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-nino-gray hover:text-nino-primary transition-colors"
          >
            I'll do this later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserTypeSelection;