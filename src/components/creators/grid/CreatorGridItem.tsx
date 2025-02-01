import { Creator } from "@/types/creator";
import CreatorCard from "../CreatorCard";

interface CreatorGridItemProps {
  creator: Creator;
  onViewProfile: (creator: Creator) => void;
}

const CreatorGridItem = ({ creator, onViewProfile }: CreatorGridItemProps) => {
  const handleInvite = (creatorId: string) => {
    console.log('Inviting creator:', creatorId);
  };

  return (
    <div className="w-full">
      <CreatorCard
        creator={creator}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default CreatorGridItem;