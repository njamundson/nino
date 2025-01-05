import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BrandOnboarding = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-6 space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-nino-text">Brand Setup</h1>
        <p className="text-nino-gray">Let's set up your brand profile</p>
      </div>

      {/* Placeholder for brand-specific onboarding steps */}
      <div className="space-y-4">
        <p className="text-center text-nino-gray">Brand onboarding steps will be implemented here</p>
      </div>

      <Button
        onClick={() => navigate("/")}
        className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default BrandOnboarding;