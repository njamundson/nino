import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PaymentStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);

  const handleComplete = () => {
    setShowWelcome(true);
    // Navigate after 2 seconds
    setTimeout(() => {
      navigate('/creator/dashboard');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <AnimatePresence>
        {!showWelcome ? (
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-medium text-nino-text">Whoo whoo!</h1>
            <p className="text-nino-gray text-sm">You're all set—welcome to Nino!</p>
            
            <Button 
              className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
              onClick={handleComplete}
            >
              Complete Setup
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white flex items-center justify-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-medium text-[#B27164]"
              style={{ fontFamily: "'SF Pro Display', sans-serif" }}
            >
              Welcome to Nino
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentStep;