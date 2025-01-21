import { Briefcase, FilePlus, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStatsData } from './useStatsData';
import StatsCard from './StatsCard';

const BrandStatsCards = () => {
  const navigate = useNavigate();
  const { completedProjects, newProposals, newMessages } = useStatsData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard
        icon={Briefcase}
        title="Completed Projects"
        value={completedProjects}
      />
      
      <StatsCard
        icon={FilePlus}
        title="New Proposals"
        value={newProposals}
      />

      <StatsCard
        icon={MessageSquare}
        title="New Messages"
        value={newMessages}
        onClick={() => navigate('/brand/messages')}
      />
    </div>
  );
};

export default BrandStatsCards;