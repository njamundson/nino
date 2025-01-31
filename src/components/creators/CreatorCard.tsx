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

  const modalCreator: CreatorData = {
    id: creator.id,
    user_id: creator.user_id,
    display_name: creator.display_name,
    first_name: creator.first_name,
    last_name: creator.last_name,
    bio: creator.bio,
    location: creator.location,
    specialties: creator.specialties,
    instagram: creator.instagram,
    website: creator.website,
    profile_image_url: creator.profile_image_url,
    creator_type: creator.creator_type,
    notifications_enabled: creator.notifications_enabled,
    onboarding_completed: creator.onboarding_completed
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