import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton = ({ loading }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-nino-primary hover:opacity-90 text-white transition-all duration-300 rounded-xl h-12 shadow-sm focus-visible:ring-2 focus-visible:ring-[#A55549] focus-visible:ring-offset-2"
      disabled={loading}
    >
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center space-x-2"
        >
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Creating account...</span>
        </motion.div>
      ) : (
        "Sign Up"
      )}
    </Button>
  );
};

export default SubmitButton;