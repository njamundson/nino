import { motion } from "framer-motion";

const ProgressBar = () => {
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-nino-primary rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default ProgressBar;