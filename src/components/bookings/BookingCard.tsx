import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BookingCardProps {
  booking: {
    opportunity: {
      title: string;
    };
    creator: {
      bio: string | null;
      specialties: string[] | null;
    };
    created_at: string;
  };
  onChatClick: () => void;
  onViewCreator: () => void;
}

const BookingCard = ({ booking, onChatClick, onViewCreator }: BookingCardProps) => {
  return (
    <Card className="p-6 border rounded-lg space-y-4 hover:border-nino-primary transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{booking.opportunity.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {booking.creator.bio}
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          Confirmed
        </Badge>
      </div>

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

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewCreator}
          >
            View Creator
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onChatClick}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Creator
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Booked on {formatDate(booking.created_at)}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;