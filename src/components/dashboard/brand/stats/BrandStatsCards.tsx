import { Briefcase, FilePlus, MessageSquare } from 'lucide-react';
import { useStatsData } from '@/components/dashboard/brand/stats/useStatsData';
import StatsCard from '@/components/dashboard/brand/stats/StatsCard';
import { motion } from 'framer-motion';

const BrandStatsCards = () => {
  const { activeProjects, newProposals, completedProjects } = useStatsData();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <motion.div variants={item}>
        <StatsCard
          icon={Briefcase}
          title="Active Bookings"
          value={activeProjects}
        />
      </motion.div>
      
      <motion.div variants={item}>
        <StatsCard
          icon={FilePlus}
          title="New Proposals"
          value={newProposals}
        />
      </motion.div>

      <motion.div variants={item}>
        <StatsCard
          icon={MessageSquare}
          title="Completed Projects"
          value={completedProjects}
          className="sm:col-span-2 lg:col-span-1"
        />
      </motion.div>
    </motion.div>
  );
};

export default BrandStatsCards;