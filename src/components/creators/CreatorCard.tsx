import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CampaignSelectionModal from "./CampaignSelectionModal";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  return (
    <Card className="group relative overflow-hidden rounded-[32px] border-0 bg-nino-bg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <div className="relative h-[400px] overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 transform">
            <img
              src={creator.imageUrl}
              alt={fullName}
              className="h-full w-full rounded-full object-cover shadow-lg"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-nino-bg via-transparent to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <h3 className="mb-2 text-2xl font-semibold tracking-tight text-nino-text">
            {fullName || 'Anonymous Creator'}
          </h3>
          
          {creator.location && (
            <p className="mb-4 text-sm font-medium text-nino-gray">
              📍 {creator.location}
            </p>
          )}

          {creator.bio && (
            <p className="mb-6 text-base text-nino-text">
              {creator.bio}
            </p>
          )}

          {creator.specialties && creator.specialties.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {creator.specialties.slice(0, 3).map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-white/10 px-4 py-1 text-sm font-medium text-nino-text transition-colors hover:bg-white/20"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          )}

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-nino-primary px-8 py-6 text-base font-medium text-white transition-all duration-300 hover:bg-nino-primary/90 hover:shadow-md"
          >
            Invite to Campaign
          </Button>
        </div>
      </div>

      <CampaignSelectionModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        creatorId={creator.id}
      />
    </Card>
  );
};

export default CreatorCard;