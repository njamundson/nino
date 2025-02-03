import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsList from "@/components/projects/ProjectsList";
import { motion } from "framer-motion";

const Projects = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ProjectsHeader />
      <ProjectsList />
    </motion.div>
  );
};

export default Projects;