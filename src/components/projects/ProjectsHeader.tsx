import { motion } from "framer-motion";

const ProjectsHeader = () => {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
        Available Projects
      </h1>
      <p className="text-lg text-gray-600">
        Discover and apply to exclusive brand collaborations
      </p>
    </motion.div>
  );
};

export default ProjectsHeader;