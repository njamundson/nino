import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  message?: string;
  onRetry?: () => void;
}

const DashboardError = ({ 
  message = "There was a problem loading your dashboard",
  onRetry 
}: DashboardErrorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-full bg-red-100 p-3"
      >
        <AlertCircle className="h-6 w-6 text-red-600" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-medium">Error Loading Dashboard</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {message}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardError;