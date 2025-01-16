import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MapPin } from "lucide-react";
import CampaignModal from "./CampaignModal";

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
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  return (
    <>
      <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white transition-all duration-300 hover:shadow-lg">
        <div className="relative p-6">
          {/* Profile Image */}
          <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full shadow-md">
            <img
              src={creator.imageUrl}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Creator Info */}
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold text-[#282828]">
              {fullName || 'Anonymous Creator'}
            </h3>
            
            {creator.location && (
              <p className="mb-3 flex items-center justify-center gap-1 text-sm text-[#282828]/70">
                <MapPin className="h-4 w-4" />
                {creator.location}
              </p>
            )}

            {creator.bio && (
              <p className="mb-4 text-sm text-[#282828]/80 line-clamp-2">
                {creator.bio}
              </p>
            )}

            {creator.specialties && creator.specialties.length > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {creator.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-[#F9F6F2] text-[#A55549] hover:bg-[#F9F6F2]/80"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              onClick={() => setShowCampaignModal(true)}
              className="w-full bg-[#A55549] text-white hover:bg-[#A55549]/90 transition-colors duration-300"
            >
              Invite to Campaign
            </Button>
          </div>
        </div>
      </Card>

      <CampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        creatorName={fullName}
      />
    </>
  );
};

export default CreatorCard;