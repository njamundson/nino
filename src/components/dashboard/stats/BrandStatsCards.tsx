import { Briefcase, FilePlus, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStatsData } from '@/components/dashboard/brand/stats/useStatsData';
import StatsCard from '@/components/dashboard/brand/stats/StatsCard';

const BrandStatsCards = () => {
  const navigate = useNavigate();
  const { activeProjects, newProposals, completedProjects } = useStatsData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
        onClick={() => navigate('/brand/messages')}
      />
    </div>
  );
};

export default BrandStatsCards;