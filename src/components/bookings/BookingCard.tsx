import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Calendar, MapPin, ExternalLink } from "lucide-react";
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
      deliverables?: string[] | null;
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

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChatClick();
  };

  const handleViewCreator = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewCreator();
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{booking.opportunity.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="capitalize">
                {booking.opportunity.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleChatClick}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewCreator}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Creator
            </Button>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-4 mb-4">
          {booking.creator.profile_image_url ? (
            <img 
              src={booking.creator.profile_image_url}
              alt={creatorName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-medium text-primary">
                {creatorName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium">{creatorName}</h4>
            <p className="text-sm text-muted-foreground">Booked Creator</p>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-3">
          {(booking.opportunity.start_date || booking.opportunity.end_date) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {booking.opportunity.start_date && formatDate(booking.opportunity.start_date)}
                {booking.opportunity.start_date && booking.opportunity.end_date && " - "}
                {booking.opportunity.end_date && formatDate(booking.opportunity.end_date)}
              </span>
            </div>
          )}

          {booking.opportunity.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{booking.opportunity.location}</span>
            </div>
          )}

          {/* Compensation */}
          {(booking.opportunity.payment_details || booking.opportunity.compensation_details) && (
            <div className="flex flex-wrap gap-2">
              {booking.opportunity.payment_details && (
                <Badge variant="outline">
                  💰 {booking.opportunity.payment_details}
                </Badge>
              )}
              {booking.opportunity.compensation_details && (
                <Badge variant="outline">
                  🎁 {booking.opportunity.compensation_details}
                </Badge>
              )}
            </div>
          )}

          {/* Deliverables */}
          {booking.opportunity.deliverables && booking.opportunity.deliverables.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Deliverables:</h5>
              <div className="flex flex-wrap gap-2">
                {booking.opportunity.deliverables.map((deliverable, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                  >
                    {deliverable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;