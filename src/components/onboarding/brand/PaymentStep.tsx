import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentStep = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    setTimeout(() => {
      navigate('/brand/welcome');
    }, 2000);
  };

  return (
    <motion.img 
      src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
      alt="Nino"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8,
        ease: "easeOut"
      }}
      onAnimationComplete={handleComplete}
    />
  );
};

export default PaymentStep;