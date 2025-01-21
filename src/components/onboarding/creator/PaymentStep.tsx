import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentStep = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    setTimeout(() => {
      navigate('/creator/dashboard');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-nino-bg">
      <motion.img 
        src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
        alt="Nino"
        className="w-48 h-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut"
        }}
        onAnimationComplete={handleComplete}
      />
    </div>
  );
};

export default PaymentStep;