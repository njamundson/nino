import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PaymentStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        navigate('/creator/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, navigate]);

  const handleComplete = () => {
    setShowWelcome(true);
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {!showWelcome ? (
          <motion.div 
            className="space-y-8 animate-fadeIn"
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-medium text-nino-text">Whoo whoo!</h1>
              <p className="text-nino-gray text-sm">You're all set—welcome to Nino!</p>
            </div>

            <Button 
              className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
              onClick={handleComplete}
            >
              Complete Setup
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-64"
          >
            <h1 className="text-4xl font-bold text-nino-primary text-center">
              Welcome to Nino
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentStep;