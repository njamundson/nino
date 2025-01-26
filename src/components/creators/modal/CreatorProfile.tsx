import { Button } from "@/components/ui/button";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  profile_image_url: string | null;
}

interface CreatorProfileProps {
  creator: Creator;
  onInviteClick: () => void;
  onMessageClick?: () => void;
}

const CreatorProfile = ({ creator, onInviteClick, onMessageClick }: CreatorProfileProps) => {
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <CreatorImage 
          profileImageUrl={creator.profile_image_url} 
          fullName={fullName} 
        />
        
        <div className="flex flex-col h-full space-y-6">
          <CreatorBio 
            bio={creator.bio}
            location={creator.location}
            specialties={creator.specialties}
            instagram={creator.instagram}
            website={creator.website}
            onMessageClick={onMessageClick}
          />

          <div className="mt-auto">
            <Button
              size="lg"
              className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white rounded-[24px] shadow-md transition-all duration-300 hover:shadow-lg"
              onClick={onInviteClick}
            >
              Invite to Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;