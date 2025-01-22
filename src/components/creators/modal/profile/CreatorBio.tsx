import SocialLinks from "./social/SocialLinks";
import CreatorSpecialties from "./bio/CreatorSpecialties";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  creatorType?: string;
  onMessageClick?: () => void;
}

const CreatorBio = ({ 
  bio, 
  specialties, 
  location,
  instagram,
  website,
  creatorType,
  onMessageClick 
}: CreatorBioProps) => {
  return (
    <div className="flex-grow space-y-6">
      {location && (
        <p className="text-nino-gray flex items-center gap-2">
          <span className="text-lg">📍</span> {location}
        </p>
      )}
      
      <div className="space-y-2">
        <SocialLinks 
          instagram={instagram}
          website={website}
          onMessageClick={onMessageClick}
        />

        <h3 className="text-lg font-semibold text-nino-text">About</h3>
        <p className="text-base leading-relaxed text-nino-text/90">
          {bio || "No bio available"}
        </p>
      </div>

      <CreatorSpecialties specialties={specialties} />
    </div>
  );
};

export default CreatorBio;