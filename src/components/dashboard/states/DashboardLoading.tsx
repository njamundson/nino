import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DashboardLoadingProps {
  message?: string;
}

const DashboardLoading = ({ message = "Loading your dashboard..." }: DashboardLoadingProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-4"
    >
      <LoadingSpinner size="lg" className="text-nino-primary" />
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default DashboardLoading;