import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const EmptyProjects = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      <Card className="p-8 text-center">
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                staggerChildren: 0.1,
              }
            }
          }}
        >
          <motion.div 
            className="rounded-full bg-nino-primary/10 p-4"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }
            }}
          >
            <Search className="h-8 w-8 text-nino-primary" />
          </motion.div>
          <motion.div 
            className="space-y-2"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }
            }}
          >
            <h3 className="text-lg font-medium">No projects available</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No projects matching your criteria at the moment. Check back soon for new opportunities to collaborate with amazing brands!
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default EmptyProjects;