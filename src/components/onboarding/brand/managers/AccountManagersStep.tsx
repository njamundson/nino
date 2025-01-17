import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AccountManagersStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      // Get the brand ID for the current user
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id, created_at')
        .eq('user_id', user.id)
        .single();

      if (brandError || !brand) {
        toast({
          title: "Error",
          description: "Could not find brand information",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Brand setup completed successfully. Team members can be added after 5 minutes.",
      });

      navigate("/brand/dashboard");
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h1 className="text-[40px] font-medium text-nino-text">Account Managers</h1>
        <p className="text-nino-gray text-xl">
          Team members can be added to your brand account 5 minutes after setup completion.
        </p>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleComplete}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8 py-2 rounded-md"
        >
          Complete Setup
        </button>
      </div>
    </motion.div>
  );
};

export default AccountManagersStep;