import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NinoWelcomeMessage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        // Check if user has a brand profile and has completed onboarding
        const { data: brand } = await supabase
          .from('brands')
          .select('id, onboarding_completed')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!brand) {
          navigate('/');
          return;
        }

        // Only show welcome message and redirect to dashboard if onboarding is complete
        if (brand.onboarding_completed) {
          const redirectTimeout = setTimeout(() => {
            navigate('/brand/dashboard');
            toast({
              title: "Welcome!",
              description: "Your brand profile has been set up successfully.",
            });
          }, 2000);

          return () => clearTimeout(redirectTimeout);
        } else {
          // If somehow they got here without completing onboarding, redirect back
          navigate('/onboarding/brand');
        }
      } catch (error) {
        console.error('Error in redirect:', error);
        navigate('/');
      }
    };

    checkUserAndRedirect();
  }, [navigate, toast]);

  return (
    <motion.img 
      src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
      alt="Nino"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.8,
        ease: "easeInOut"
      }}
    />
  );
};

export default NinoWelcomeMessage;