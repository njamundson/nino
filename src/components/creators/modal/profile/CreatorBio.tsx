import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-react";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
}

const CreatorBio = ({ bio, specialties, location }: CreatorBioProps) => {
  return (
    <div className="flex-grow space-y-6">
      {location && (
        <p className="text-nino-gray flex items-center gap-2">
          <span className="text-lg">📍</span> {location}
        </p>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-nino-text flex items-center gap-2">
          <Instagram className="w-5 h-5 text-nino-primary" />
          About
        </h3>
        <p className="text-base leading-relaxed text-nino-text/90">
          {bio || "No bio available"}
        </p>
      </div>

      {specialties && specialties.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
          <div className="flex flex-wrap gap-2 max-w-full">
            {specialties.map((specialty, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="px-3 py-1 rounded-full border-2 border-nino-primary text-nino-primary bg-white/50 hover:bg-white transition-colors whitespace-nowrap"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBio;