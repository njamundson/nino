import { Card } from "@/components/ui/card";
import { CreatorData } from "@/types/creator";
import CreatorCardImage from "./card/CreatorCardImage";

interface CreatorCardProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCard = ({ creator, onInvite }: CreatorCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer"
      onClick={() => onInvite(creator.id)}
    >
      <CreatorCardImage creator={creator} />
    </Card>
  );
};

export default CreatorCard;