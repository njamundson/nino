import { MapPin } from "lucide-react";
import { CreatorSpecialties } from "@/components/campaigns/card/creator/CreatorSpecialties";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorBioProps {
  bio?: string | null;
  specialties?: string[] | null;
  location?: string | null;
  instagram?: string | null;
  website?: string | null;
  onMessageClick?: () => void;
  fullName: string;
}

const CreatorBio = ({
  bio,
  specialties,
  location,
  onMessageClick,
  fullName,
}: CreatorBioProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className={`font-semibold text-nino-text ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          {fullName}
        </h2>
        {location && (
          <p className="text-nino-gray flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4" />
            {location}
          </p>
        )}
      </div>

      {bio && (
        <p className={`text-nino-text ${isMobile ? 'text-sm' : 'text-base'}`}>
          {bio}
        </p>
      )}

      {specialties && specialties.length > 0 && (
        <div className="space-y-2">
          <h3 className={`font-medium text-nino-text ${isMobile ? 'text-sm' : 'text-base'}`}>
            Specialties
          </h3>
          <CreatorSpecialties specialties={specialties} />
        </div>
      )}

      {onMessageClick && (
        <button
          onClick={onMessageClick}
          className="w-full bg-white text-nino-primary border border-nino-primary/20 px-6 py-3 rounded-2xl hover:bg-nino-primary/5 transition-all duration-300 font-medium text-sm"
        >
          Message
        </button>
      )}
    </div>
  );
};

export default CreatorBio;