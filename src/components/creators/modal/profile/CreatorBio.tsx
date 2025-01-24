import { Button } from "@/components/ui/button";
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

      <div className="space-y-4 mt-auto">
        <Button
          variant="outline"
          onClick={onMessageClick}
          className="w-full bg-[#D6BCFA] hover:bg-[#D6BCFA]/90 text-gray-700 py-6 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default CreatorBio;