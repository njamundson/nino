import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";

interface BrowseCreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
}

const BrowseCreatorProfile = ({ 
  creator, 
  onClose, 
  onInviteClick, 
  onMessageClick 
}: BrowseCreatorProfileProps) => {
  if (!creator) return null;

  const fullName = creator.display_name || 'Creator';

  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 h-full">
        <div className="relative h-full">
          <CreatorImage 
            profileImageUrl={creator.profile_image_url} 
            fullName={fullName} 
          />
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex-grow space-y-6">
            <CreatorBio 
              bio={creator.bio}
              specialties={creator.specialties}
              location={creator.location}
              instagram={creator.instagram}
              website={creator.website}
              onMessageClick={onMessageClick}
              fullName={fullName}
            />
          </div>

          {onInviteClick && (
            <button
              onClick={onInviteClick}
              className="mt-4 w-full bg-white/80 backdrop-blur-sm text-nino-primary border border-nino-primary/20 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 font-medium text-sm"
            >
              Invite to Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCreatorProfile;