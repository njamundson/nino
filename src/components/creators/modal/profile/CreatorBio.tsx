import SocialLinks from "./social/SocialLinks";
import CreatorSpecialties from "./bio/CreatorSpecialties";
import { MapPin } from "lucide-react";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
  coverLetter?: string | null;
}

const CreatorBio = ({ 
  bio, 
  specialties, 
  location,
  instagram,
  website,
  onMessageClick,
  coverLetter
}: CreatorBioProps) => {
  return (
    <div className="flex-grow space-y-6">
      {location && (
        <div className="flex items-center gap-2 text-nino-gray">
          <MapPin className="w-5 h-5" />
          <span className="text-base">{location}</span>
        </div>
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

      {coverLetter && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-nino-text">Application Message</h3>
          <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
            <p className="text-base leading-relaxed text-nino-text/90 whitespace-pre-wrap break-words">
              {coverLetter}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBio;