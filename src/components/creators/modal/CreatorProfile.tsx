import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";

interface CreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
}

const CreatorProfile = ({ creator, onClose, onInviteClick, onMessageClick }: CreatorProfileProps) => {
  const fullName = creator.first_name && creator.last_name 
    ? `${creator.first_name} ${creator.last_name}`
    : 'Creator';

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold text-gray-900 px-6 mb-2">
        {fullName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <CreatorImage 
          profileImageUrl={creator.profile_image_url} 
          fullName={fullName} 
        />
        <div className="space-y-6">
          <CreatorBio 
            bio={creator.bio}
            specialties={creator.specialties}
            location={creator.location}
            instagram={creator.instagram}
            website={creator.website}
            onMessageClick={onMessageClick}
            coverLetter={undefined}
          />
          <CreatorSocialLinks 
            instagram={creator.instagram}
            website={creator.website}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;