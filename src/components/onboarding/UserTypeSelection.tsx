import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (type: "creator" | "brand") => {
    navigate(`/onboarding/${type}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-6 space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-nino-text">Welcome to NINO</h1>
        <p className="text-nino-gray">Let's get started by selecting your role</p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => handleSelection("creator")}
          className="w-full h-24 text-lg bg-white hover:bg-nino-bg border-2 border-transparent hover:border-nino-primary text-nino-text transition-all duration-200"
          variant="outline"
        >
          I'm a Creator
          <p className="text-sm text-nino-gray mt-2">
            I want to collaborate with brands
          </p>
        </Button>

        <Button
          onClick={() => handleSelection("brand")}
          className="w-full h-24 text-lg bg-white hover:bg-nino-bg border-2 border-transparent hover:border-nino-primary text-nino-text transition-all duration-200"
          variant="outline"
        >
          I'm a Brand
          <p className="text-sm text-nino-gray mt-2">
            I want to work with creators
          </p>
        </Button>
      </div>
    </motion.div>
  );
};

export default UserTypeSelection;