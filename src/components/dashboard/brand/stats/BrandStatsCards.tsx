import { Briefcase, FilePlus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStatsData } from './useStatsData';
import StatsCard from './StatsCard';

const BrandStatsCards = () => {
  const navigate = useNavigate();
  const { activeProjects, newProposals, completedProjects } = useStatsData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard
        icon={Briefcase}
        title="Active Projects"
        value={activeProjects}
      />
      
      <StatsCard
        icon={FilePlus}
        title="New Proposals"
        value={newProposals}
      />

      <StatsCard
        icon={CheckCircle}
        title="Completed Projects"
        value={completedProjects}
      />
    </div>
  );
};

export default BrandStatsCards;