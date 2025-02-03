import { Creator } from "@/types/creator";
import CreatorCard from "../CreatorCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorGridItemProps {
  creator: Creator;
  onViewProfile: (creator: Creator) => void;
}

const CreatorGridItem = ({ creator, onViewProfile }: CreatorGridItemProps) => {
  const isMobile = useIsMobile();
  
  const handleInvite = (creatorId: string) => {
    console.log('Inviting creator:', creatorId);
  };

  return (
    <div className={`w-full ${isMobile ? 'px-4 mb-4' : ''}`}>
      <CreatorCard
        creator={creator}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default CreatorGridItem;