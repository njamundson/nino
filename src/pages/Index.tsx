import { motion } from "framer-motion";
import AuthCard from "@/components/auth/AuthCard";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-[#F9F6F2] p-4"
    >
      <AuthCard />
    </motion.div>
  );
};

export default Index;