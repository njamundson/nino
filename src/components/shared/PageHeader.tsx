import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="mb-8"
    >
      <h1 className="text-3xl font-medium tracking-tight text-nino-text">
        {title}
      </h1>
      <p className="mt-2 text-lg text-nino-gray">{description}</p>
    </motion.div>
  );
};

export default PageHeader;