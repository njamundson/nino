import { Briefcase, FilePlus, MessageSquare } from 'lucide-react';
import { useStatsData } from '@/components/dashboard/brand/stats/useStatsData';
import StatsCard from '@/components/dashboard/brand/stats/StatsCard';

const BrandStatsCards = () => {
  const { activeProjects, newProposals, completedProjects } = useStatsData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <StatsCard
        icon={Briefcase}
        title="Active Bookings"
        value={activeProjects}
      />
      
      <StatsCard
        icon={FilePlus}
        title="New Proposals"
        value={newProposals}
      />

      <StatsCard
        icon={MessageSquare}
        title="Completed Projects"
        value={completedProjects}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
};

export default BrandStatsCards;