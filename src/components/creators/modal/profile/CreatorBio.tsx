import SocialLinks from "./social/SocialLinks";
import CreatorSpecialties from "./bio/CreatorSpecialties";

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
      </div>

      <CreatorSpecialties specialties={specialties} />

      {coverLetter && (
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-nino-text">Application Message</h3>
          <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
            <p className="text-nino-text/90 leading-relaxed whitespace-pre-wrap">
              {coverLetter}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBio;