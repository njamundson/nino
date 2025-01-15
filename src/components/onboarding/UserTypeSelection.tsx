import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, Briefcase } from "lucide-react";

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (type: "creator" | "brand") => {
    navigate(`/onboarding/${type}`);
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Progress indicator */}
        <div className="w-full bg-[#E5DEFF] h-1 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#9b87f5] rounded-full" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-[#1d1d1f]">
            Tell us about yourself
          </h1>
          <p className="text-[#86868b]">
            Select your role to personalize your experience
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection("creator")}
            className="w-full bg-white hover:bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-8 text-left transition-all duration-200 group shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-[#F1F0FB] rounded-xl group-hover:bg-white transition-colors">
                <Star className="h-7 w-7 text-[#9b87f5]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1d1d1f]">Creator</h3>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection("brand")}
            className="w-full bg-white hover:bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-8 text-left transition-all duration-200 group shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-[#F1F0FB] rounded-xl group-hover:bg-white transition-colors">
                <Briefcase className="h-7 w-7 text-[#9b87f5]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1d1d1f]">Brand</h3>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Skip button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#86868b] hover:text-[#9b87f5] transition-colors"
          >
            I'll do this later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserTypeSelection;