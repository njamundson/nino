import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BookingCardProps {
  booking: {
    opportunity: {
      title: string;
      status: string;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      payment_details: string | null;
      compensation_details: string | null;
    };
    creator: {
      bio: string | null;
      specialties: string[] | null;
      profile: {
        first_name: string | null;
        last_name: string | null;
      } | null;
      profile_image_url: string | null;
    };
    created_at: string;
  };
  onChatClick: () => void;
  onViewCreator: () => void;
}

const BookingCard = ({ booking, onChatClick, onViewCreator }: BookingCardProps) => {
  const creatorName = booking.creator.profile ? 
    `${booking.creator.profile.first_name} ${booking.creator.profile.last_name}` : 
    'Anonymous Creator';

  return (
    <Card 
      className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
    >
      <div className="relative h-full">
        {/* Creator Image */}
        <div className="h-full w-full">
          {booking.creator.profile_image_url ? (
            <img 
              src={booking.creator.profile_image_url} 
              alt={creatorName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-nino-primary/10 flex items-center justify-center">
              <span className="text-4xl font-medium text-nino-primary">
                {creatorName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-20 left-6 right-6 text-white">
          <p className="text-sm font-medium text-white/90 mb-1">
            {creatorName}
          </p>
          <h3 className="text-2xl font-semibold leading-tight line-clamp-2">
            {booking.opportunity.title}
          </h3>
          {booking.opportunity.location && (
            <p className="text-sm text-white/80 mt-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {booking.opportunity.location}
            </p>
          )}
          {(booking.opportunity.payment_details || booking.opportunity.compensation_details) && (
            <div className="flex gap-2 mt-2">
              {booking.opportunity.payment_details && (
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  💰 {booking.opportunity.payment_details}
                </Badge>
              )}
              {booking.opportunity.compensation_details && (
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  🎁 {booking.opportunity.compensation_details}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onViewCreator}
            className="bg-white/90 hover:bg-white text-gray-900 transition-all duration-300 hover:scale-105 shadow-md"
          >
            View Creator
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onChatClick}
            className="bg-white/90 hover:bg-white text-gray-900 transition-all duration-300 hover:scale-105 shadow-md"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>

        {/* Status Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 capitalize shadow-md"
        >
          {booking.opportunity.status}
        </Badge>
      </div>
    </Card>
  );
};

export default BookingCard;