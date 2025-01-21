import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoTransition = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/brand/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-nino-bg flex items-center justify-center">
      <motion.img 
        src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
        alt="Nino"
        className="w-48 h-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};

export default LogoTransition;