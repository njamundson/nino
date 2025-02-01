import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

const PageHeader = ({ title, description, className }: PageHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn("mb-8", className)}
    >
      <h1 className="text-3xl font-medium tracking-tight text-nino-text">
        {title}
      </h1>
      <p className="mt-2 text-lg text-nino-gray">{description}</p>
    </motion.div>
  );
};

export default PageHeader;