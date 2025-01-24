import { useNewProposals } from "@/hooks/stats/useNewProposals";
import { useActiveBookings } from "@/hooks/stats/useActiveBookings";
import { useCompletedProjects } from "@/hooks/stats/useCompletedProjects";
import { Card } from "@/components/ui/card";
import { FileText, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)]">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-nino-primary/5 p-4">
            <Icon className="h-6 w-6 text-nino-primary" />
          </div>
          <div>
            <p className="text-sm text-nino-gray">{title}</p>
            <h4 className="text-2xl font-semibold text-nino-text mt-1">{value}</h4>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

const StatsCards = () => {
  const newProposals = useNewProposals();
  const activeBookings = useActiveBookings();
  const completedProjects = useCompletedProjects();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-3"
    >
      <StatsCard
        title="New Proposals"
        value={newProposals}
        icon={FileText}
      />
      <StatsCard
        title="Active Bookings"
        value={activeBookings}
        icon={Calendar}
      />
      <StatsCard
        title="Completed Projects"
        value={completedProjects}
        icon={CheckCircle}
      />
    </motion.div>
  );
};

export default StatsCards;