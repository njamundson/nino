import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
  application?: any;
}

const CreatorProfile = ({ 
  creator, 
  onClose, 
  onInviteClick, 
  onMessageClick,
  application 
}: CreatorProfileProps) => {
  const isMobile = useIsMobile();
  
  if (!creator) return null;

  const fullName = creator.display_name || 'Creator';

  return (
    <div className={`h-full ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-[1.2fr_1fr] gap-6'} h-full`}>
        <div className="relative h-full max-h-[400px] md:max-h-none">
          <CreatorImage 
            profileImageUrl={creator.profile_image_url} 
            fullName={fullName} 
          />
        </div>
        
        <div className={`flex flex-col h-full ${isMobile ? 'overflow-y-auto' : ''}`}>
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
            <CreatorSocialLinks 
              instagram={creator.instagram}
              website={creator.website}
            />
          </div>

          {onInviteClick && (
            <button
              onClick={onInviteClick}
              className={`mt-4 w-full bg-white/80 backdrop-blur-sm text-nino-primary border border-nino-primary/20 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 font-medium text-sm ${isMobile ? 'sticky bottom-0' : ''}`}
            >
              Invite to Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;