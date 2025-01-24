import { motion } from "framer-motion";
import AuthCard from "@/components/auth/AuthCard";
import { useState, useEffect } from "react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload the logo image
    const logo = new Image();
    logo.src = "/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png";
    logo.onload = () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-[#F9F6F2] p-4"
    >
      {!isLoading && <AuthCard />}
    </motion.div>
  );
};

export default Index;