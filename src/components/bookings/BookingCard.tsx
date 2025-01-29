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
    <Card className="group overflow-hidden bg-white hover:bg-gray-50/50 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
              {booking.opportunity.title}
            </h3>
            <Badge 
              variant="secondary" 
              className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
            >
              {booking.opportunity.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={handleChatClick}
              className="gap-2 rounded-full hover:bg-nino-primary/10 hover:text-nino-primary border-gray-200"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewCreator}
              className="gap-2 rounded-full hover:bg-nino-primary/10 hover:text-nino-primary border-gray-200"
            >
              <ExternalLink className="w-4 h-4" />
              View Creator
            </Button>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
          {booking.creator.profile_image_url ? (
            <img 
              src={booking.creator.profile_image_url}
              alt={creatorName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-nino-primary/10 flex items-center justify-center ring-2 ring-white">
              <span className="text-lg font-medium text-nino-primary">
                {creatorName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-900">{creatorName}</h4>
            <p className="text-sm text-gray-500">Booked Creator</p>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(booking.opportunity.start_date || booking.opportunity.end_date) && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {booking.opportunity.start_date && formatDate(booking.opportunity.start_date)}
                  {booking.opportunity.start_date && booking.opportunity.end_date && " - "}
                  {booking.opportunity.end_date && formatDate(booking.opportunity.end_date)}
                </span>
              </div>
            )}

            {booking.opportunity.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{booking.opportunity.location}</span>
              </div>
            )}
          </div>

          {/* Compensation */}
          {(booking.opportunity.payment_details || booking.opportunity.compensation_details) && (
            <div className="flex flex-wrap gap-2">
              {booking.opportunity.payment_details && (
                <Badge variant="outline" className="rounded-full border-gray-200">
                  💰 {booking.opportunity.payment_details}
                </Badge>
              )}
              {booking.opportunity.compensation_details && (
                <Badge variant="outline" className="rounded-full border-gray-200">
                  🎁 {booking.opportunity.compensation_details}
                </Badge>
              )}
            </div>
          )}

          {/* Deliverables */}
          {booking.opportunity.deliverables && booking.opportunity.deliverables.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Deliverables</h5>
              <div className="flex flex-wrap gap-2">
                {booking.opportunity.deliverables.map((deliverable, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
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