import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BookingCardProps {
  booking: {
    opportunity: {
      title: string;
      status: string;
      start_date: string | null;
      end_date: string | null;
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
    <Card className="p-6 border rounded-lg space-y-4 hover:border-nino-primary transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {booking.creator.profile_image_url ? (
              <img 
                src={booking.creator.profile_image_url} 
                alt={creatorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-nino-primary/10 text-nino-primary font-medium">
                {creatorName.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">{booking.opportunity.title}</h3>
            <p className="text-sm text-muted-foreground">
              with {creatorName}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {booking.opportunity.status}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        {booking.creator.bio || "No bio available"}
      </p>

      {booking.creator.specialties && booking.creator.specialties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {booking.creator.specialties.map((specialty: string, index: number) => (
            <Badge 
              key={index}
              variant="secondary"
              className="bg-nino-primary/10 text-nino-primary"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewCreator}
          >
            View Creator
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onChatClick}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Booked on {formatDate(booking.created_at)}</span>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;