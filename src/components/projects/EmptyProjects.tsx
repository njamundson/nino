import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyProjects = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Available Projects
      </h3>
      <p className="text-gray-500 mb-6">
        Check back soon for new opportunities!
      </p>
      <Button 
        variant="outline"
        onClick={() => navigate("/creator/dashboard")}
      >
        Return to Dashboard
      </Button>
    </motion.div>
  );
};

export default EmptyProjects;