import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NinoWelcomeMessage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let redirectTimeout: NodeJS.Timeout;

    const checkUserAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/', { replace: true });
          return;
        }

        // Check if user has a brand profile
        const { data: brand } = await supabase
          .from('brands')
          .select('id, company_name')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!brand) {
          navigate('/', { replace: true });
          return;
        }

        // Start fade out after 2 seconds
        fadeTimeout = setTimeout(() => {
          setIsVisible(false);
        }, 2000);

        // Navigate after fade out animation completes
        redirectTimeout = setTimeout(() => {
          toast({
            title: "Welcome!",
            description: "Your brand profile has been set up successfully.",
          });
          // Force navigation to the brand dashboard
          window.location.href = '/brand/dashboard';
        }, 2500); // 2 seconds + 0.5 seconds for fade out
      } catch (error) {
        console.error('Error in welcome message redirect:', error);
        navigate('/', { replace: true });
      }
    };

    checkUserAndRedirect();

    // Cleanup timeouts
    return () => {
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [navigate, toast]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.img 
            src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
            alt="Nino"
            className="w-48 h-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NinoWelcomeMessage;