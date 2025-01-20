import CreatorCard from "./CreatorCard";
import { useCreatorData } from "./grid/useCreatorData";
import LoadingState from "./grid/LoadingState";
import EmptyState from "./grid/EmptyState";

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorTypes: string[];
  onInvite: (creatorId: string) => void;
}

const CreatorGrid = ({ 
  selectedSpecialties, 
  selectedCreatorTypes, 
  onInvite 
}: CreatorGridProps) => {
  const { creators, loading } = useCreatorData({ 
    selectedSpecialties, 
    selectedCreatorTypes 
  });

  if (loading) {
    return <LoadingState />;
  }

  if (!creators.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onInvite={() => onInvite(creator.id)}
        />
      ))}
    </div>
  );
};

export default CreatorGrid;