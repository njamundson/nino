import { useState } from "react";
import { Card } from "@/components/ui/card";
import CreatorModal from "./CreatorModal";
import { useCreatorInvite } from "@/hooks/useCreatorInvite";
import { CreatorData } from "@/types/creator";
import CreatorCardImage from "./card/CreatorCardImage";

interface CreatorCardProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCard = ({ creator, onInvite }: CreatorCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleInvite } = useCreatorInvite();

  // Add console.log to debug creator data
  console.log('CreatorCard - Full creator data:', creator);

  const handleInviteClick = async (creatorId: string) => {
    const success = await handleInvite(creatorId);
    if (success) {
      setIsModalOpen(false);
      onInvite(creatorId);
    }
  };

  const modalCreator = {
    id: creator.id,
    bio: creator.bio,
    location: creator.location,
    specialties: creator.specialties,
    instagram: creator.instagram,
    website: creator.website,
    firstName: creator.firstName || creator.profile?.first_name || '',
    lastName: creator.lastName || creator.profile?.last_name || '',
    profile_image_url: creator.profileImage || creator.profile_image_url,
    profile: creator.profile
  };

  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CreatorCardImage creator={creator} onInvite={handleInviteClick} />
      </Card>

      <CreatorModal
        creator={modalCreator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreatorCard;