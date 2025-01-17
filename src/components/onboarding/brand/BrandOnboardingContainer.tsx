import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BrandOnboardingContainerProps {
  children: ReactNode;
}

const BrandOnboardingContainer = ({ children }: BrandOnboardingContainerProps) => {
  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-sm"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BrandOnboardingContainer;