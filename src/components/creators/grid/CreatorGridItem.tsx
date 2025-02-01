import { Creator } from "@/types/creator";
import CreatorCard from "../CreatorCard";

interface CreatorGridItemProps {
  creator: Creator;
  onViewProfile: (creator: Creator) => void;
}

const CreatorGridItem = ({ creator, onViewProfile }: CreatorGridItemProps) => {
  return (
    <div className="w-full">
      <CreatorCard
        creator={creator}
        onViewProfile={() => onViewProfile(creator)}
      />
    </div>
  );
};

export default CreatorGridItem;