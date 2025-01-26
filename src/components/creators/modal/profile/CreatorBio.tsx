import SocialLinks from "./social/SocialLinks";
import CreatorSpecialties from "./bio/CreatorSpecialties";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
  coverLetter?: string | null; // Add cover letter prop
}

const CreatorBio = ({ 
  bio, 
  specialties, 
  location,
  instagram,
  website,
  onMessageClick,
  coverLetter // Add cover letter to destructuring
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

      {/* Add Application Message section */}
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