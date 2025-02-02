import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { MessageSquare, User } from "lucide-react";

interface BookingCardProps {
  creator: Creator;
  onMessageClick: () => void;
  onViewCreator: () => void;
}

const BookingCard = ({ creator, onMessageClick, onViewCreator }: BookingCardProps) => {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]">
      <div className="relative h-full w-full">
        {/* Profile Image */}
        <div className="h-[250px] w-full overflow-hidden">
          {creator.profile_image_url ? (
            <img
              src={creator.profile_image_url}
              alt={`${creator.display_name}'s profile`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 border-0"
          >
            Active Booking
          </Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {creator.display_name}
              </h3>
              {creator.location && (
                <p className="text-sm text-white/90 mb-1">
                  📍 {creator.location}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onMessageClick}
                className="bg-white/90 hover:bg-white text-gray-900 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCreator}
                className="bg-transparent border-white/20 text-white hover:bg-white/20"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;