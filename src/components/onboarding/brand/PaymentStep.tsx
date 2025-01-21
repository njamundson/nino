import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentStep = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Store authentication status in localStorage for development
    localStorage.setItem('isAuthenticated', 'true');
    
    setTimeout(() => {
      navigate('/brand/dashboard');
    }, 2000);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-nino-bg flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img 
        src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
        alt="Nino"
        className="w-48 h-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        onAnimationComplete={handleComplete}
      />
    </motion.div>
  );
};

export default PaymentStep;