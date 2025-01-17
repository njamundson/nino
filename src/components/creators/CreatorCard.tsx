import { useState } from "react";
import { Card } from "@/components/ui/card";
import CreatorModal from "./CreatorModal";
import { useCreatorInvite } from "@/hooks/useCreatorInvite";
import { CreatorData } from "@/types/creator";
import CreatorCardImage from "./card/CreatorCardImage";

interface CreatorCardProps {
  creator: CreatorData;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleInvite } = useCreatorInvite();

  const onInvite = async (creatorId: string) => {
    const success = await handleInvite(creatorId);
    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CreatorCardImage creator={creator} onInvite={onInvite} />
      </Card>

      <CreatorModal
        creator={{
          ...creator,
          imageUrl: creator.profileImage || '/placeholder.svg',
          profile: {
            first_name: creator.firstName,
            last_name: creator.lastName
          }
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreatorCard;