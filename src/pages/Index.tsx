import { motion } from "framer-motion";
import AuthFlow from "@/components/auth/AuthFlow";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-[#F9F6F2] p-4"
    >
      <div className="w-full max-w-md">
        <AuthFlow />
      </div>
    </motion.div>
  );
};

export default Index;