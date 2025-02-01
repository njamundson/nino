import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { CreatorSocials } from "../campaigns/card/creator/CreatorSocials";
import { CreatorSpecialties } from "../campaigns/card/creator/CreatorSpecialties";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BookingDetailsCardProps {
  creator: Creator;
  onCancel?: () => void;
  onDelete?: () => void;
  status?: string;
}

export const BookingDetailsCard = ({
  creator,
  onCancel,
  onDelete,
  status = "pending"
}: BookingDetailsCardProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={creator.profile_image_url || ""} />
            <AvatarFallback>
              {creator.display_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {creator.display_name}
              </h3>
              {creator.location && (
                <p className="text-gray-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {creator.location}
                </p>
              )}
            </div>
            
            {creator.creator_type && (
              <Badge variant="secondary" className="capitalize">
                {creator.creator_type}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {status && (
            <Badge 
              variant={status === "completed" ? "default" : "secondary"}
              className="capitalize"
            >
              {status}
            </Badge>
          )}
          
          <div className="flex gap-2">
            {onCancel && status !== "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {creator.bio && (
          <p className="text-gray-600">
            {creator.bio}
          </p>
        )}

        {creator.specialties && creator.specialties.length > 0 && (
          <CreatorSpecialties specialties={creator.specialties} />
        )}

        <CreatorSocials creator={creator} />
      </div>
    </Card>
  );
};

export default BookingDetailsCard;