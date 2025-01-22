import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const NinoWelcomeMessage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate('/brand/dashboard', { replace: true });
      
      toast({
        title: "Welcome!",
        description: "Your brand profile has been set up successfully.",
      });
    }, 2000);

    return () => clearTimeout(redirectTimeout);
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