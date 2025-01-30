import { useState } from "react";
import { Card } from "@/components/ui/card";
import CreatorModal from "./CreatorModal";
import { useCreatorInvite } from "@/hooks/useCreatorInvite";
import { CreatorData } from "@/types/creator";
import CreatorCardImage from "./card/CreatorCardImage";
import { useNavigate } from "react-router-dom";

interface CreatorCardProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCard = ({ creator, onInvite }: CreatorCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleInvite, isInviting } = useCreatorInvite();
  const navigate = useNavigate();

  const handleInviteClick = async (creatorId: string, opportunityId: string) => {
    const success = await handleInvite(creatorId, opportunityId);
    if (success) {
      setIsModalOpen(false);
      onInvite(creatorId);
    }
  };

  const handleChatClick = () => {
    navigate(`/brand/messages?userId=${creator.user_id}`);
  };

  const modalCreator = {
    id: creator.id,
    bio: creator.bio,
    location: creator.location,
    specialties: creator.specialties,
    instagram: creator.instagram,
    website: creator.website,
    first_name: creator.firstName,
    last_name: creator.lastName,
    profile_image_url: creator.profile_image_url,
    creator_type: creator.creatorType
  };

  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CreatorCardImage 
          creator={creator} 
          onInvite={handleInviteClick}
          isInviting={isInviting}
        />
      </Card>

      <CreatorModal
        creator={modalCreator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMessageClick={handleChatClick}
      />
    </>
  );
};

export default CreatorCard;