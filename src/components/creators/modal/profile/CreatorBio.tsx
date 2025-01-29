import { MapPin } from "lucide-react";
import CreatorSpecialties from "./bio/CreatorSpecialties";
import SocialLinks from "./social/SocialLinks";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
  coverLetter?: string | null;
  fullName: string;
}

const CreatorBio = ({ 
  bio, 
  specialties,
  location,
  instagram,
  website,
  onMessageClick,
  coverLetter,
  fullName
}: CreatorBioProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-nino-text">
          {fullName}
        </h2>
        {location && (
          <div className="flex items-center gap-2 text-nino-gray">
            <MapPin className="h-5 w-5" />
            <span className="text-base">{location}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <SocialLinks 
          instagram={instagram}
          website={website}
          onMessageClick={onMessageClick}
        />
      </div>

      {bio && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-nino-text">About</h3>
          <p className="text-nino-gray">{bio}</p>
        </div>
      )}

      {specialties && specialties.length > 0 && (
        <CreatorSpecialties specialties={specialties} />
      )}

      {coverLetter && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-nino-text">Cover Letter</h3>
          <p className="text-nino-gray">{coverLetter}</p>
        </div>
      )}
    </div>
  );
};

export default CreatorBio;