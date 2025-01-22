import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
          .select('id, company_name')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!brand) {
          navigate('/');
          return;
        }

        // Only show welcome message and redirect to dashboard if onboarding is complete
        if (brand.company_name) {
          // Set a timeout for the animation and redirect
          const redirectTimeout = setTimeout(() => {
            // First show the toast
            toast({
              title: "Welcome!",
              description: "Your brand profile has been set up successfully.",
            });
            
            // Then set another short timeout for the redirect to allow the animation to complete
            setTimeout(() => {
              navigate('/brand/dashboard', { replace: true });
            }, 800); // Delay the redirect slightly to allow the exit animation to play
          }, 2000); // Show welcome message for 2 seconds

          return () => clearTimeout(redirectTimeout);
        }
      } catch (error) {
        console.error('Error in redirect:', error);
        navigate('/');
      }
    };

    checkUserAndRedirect();
  }, [navigate, toast]);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.img 
          src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
          alt="Nino"
          className="w-48 h-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            duration: 0.6,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default NinoWelcomeMessage;