import { Creator } from "@/types/creator";
import CreatorBio from "../../creators/modal/profile/CreatorBio";
import CreatorImage from "../../creators/modal/profile/CreatorImage";
import CreatorSocialLinks from "../../creators/modal/profile/CreatorSocialLinks";

interface BookedCreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
  onMessageClick?: () => void;
  onCancelBooking?: () => void;
}

const BookedCreatorProfile = ({ 
  creator, 
  onClose, 
  onMessageClick,
  onCancelBooking
}: BookedCreatorProfileProps) => {
  if (!creator) return null;

  const fullName = creator.first_name && creator.last_name 
    ? `${creator.first_name} ${creator.last_name}`
    : creator.first_name || 'Creator';

  return (
    <div className="h-full p-6 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 h-full">
        <div className="relative h-full max-h-[600px] overflow-hidden rounded-2xl">
          <CreatorImage 
            profileImageUrl={creator.profile_image_url} 
            fullName={fullName} 
          />
        </div>
        
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-grow space-y-6 pr-2">
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

          {onCancelBooking && (
            <button
              onClick={onCancelBooking}
              className="mt-4 w-full bg-destructive/10 text-destructive hover:bg-destructive/20 px-6 py-3 rounded-2xl transition-all duration-300 font-medium text-sm"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookedCreatorProfile;