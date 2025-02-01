import { Card } from "@/components/ui/card";
import { Creator } from "@/types/creator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserRound } from "lucide-react";
import { CreatorSpecialties } from "../campaigns/card/creator/CreatorSpecialties";
import { CreatorInfo } from "../campaigns/card/creator/CreatorInfo";
import { CreatorSocials } from "../campaigns/card/creator/CreatorSocials";

interface BookingCardProps {
  creator: Creator;
  onMessageClick?: () => void;
  onViewCreator?: () => void;
}

const BookingCard = ({ creator, onMessageClick, onViewCreator }: BookingCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
        <div className="relative h-[300px] md:h-full">
          {creator.profile_image_url ? (
            <img
              src={creator.profile_image_url}
              alt={creator.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <UserRound className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <CreatorInfo creator={creator} />
            <CreatorSpecialties specialties={creator.specialties || []} />
            <CreatorSocials creator={creator} onMessageClick={onMessageClick} />
          </div>

          <div className="flex items-center gap-3">
            {onMessageClick && (
              <Button
                onClick={onMessageClick}
                variant="outline"
                className="gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            )}
            {onViewCreator && (
              <Button
                onClick={onViewCreator}
                variant="outline"
                className="gap-2"
              >
                <UserRound className="w-4 h-4" />
                View Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;