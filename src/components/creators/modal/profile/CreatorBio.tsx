import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import CreatorSpecialties from "./bio/CreatorSpecialties";

export interface CreatorBioProps {
  bio: string;
  location: string | null;
  specialties: string[];
  instagram: string | null;
  website: string | null;
  onMessageClick: () => Promise<void>;
}

const CreatorBio = ({ 
  bio, 
  location, 
  specialties,
  onMessageClick
}: CreatorBioProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {location && (
              <p className="text-sm text-nino-gray">📍 {location}</p>
            )}
          </div>
          <Button 
            onClick={onMessageClick}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Creator
          </Button>
        </div>
        <p className="text-nino-gray leading-relaxed">{bio}</p>
      </div>

      <CreatorSpecialties specialties={specialties} />
    </div>
  );
};

export default CreatorBio;