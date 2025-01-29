import BrandStatsCards from "./brand/stats/BrandStatsCards";
import DashboardContent from "./brand/content/DashboardContent";
import { motion } from "framer-motion";

const BrandDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 px-4 sm:px-0"
    >
      <BrandStatsCards />
      <DashboardContent />
    </motion.div>
  );
};

export default BrandDashboard;