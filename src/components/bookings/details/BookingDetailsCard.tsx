import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CreatorSection from "./CreatorSection";

interface BookingDetailsCardProps {
  creator: {
    id: string;
    first_name: string;
    last_name: string | null;
    profile_image_url: string | null;
  };
  booking: {
    id: string;
    opportunity: {
      id: string;
      title: string;
      status: string;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      payment_details: string | null;
      compensation_details: string | null;
    };
  };
  onChatClick: () => void;
  onViewCreator: () => void;
  onRefresh: () => void;
}

const BookingDetailsCard = ({
  creator,
  booking,
  onChatClick,
  onViewCreator,
  onRefresh,
}: BookingDetailsCardProps) => {
  return (
    <Card className="p-6 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm space-y-6">
      {/* Campaign Details Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
              {booking.opportunity.title}
            </h3>
            <Badge 
              variant="secondary" 
              className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
            >
              {booking.opportunity.status === 'open' 
                ? 'Campaign is still hiring creators' 
                : 'Campaign is done hiring creators'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          {(booking.opportunity.start_date || booking.opportunity.end_date) && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {booking.opportunity.start_date && formatDate(booking.opportunity.start_date)}
                {booking.opportunity.start_date && booking.opportunity.end_date && " - "}
                {booking.opportunity.end_date && formatDate(booking.opportunity.end_date)}
              </span>
            </div>
          )}

          {booking.opportunity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{booking.opportunity.location}</span>
            </div>
          )}
        </div>

        {/* Payment and Compensation Details */}
        {(booking.opportunity.payment_details || booking.opportunity.compensation_details) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            {booking.opportunity.payment_details && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Payment Details:</span>
                <p className="mt-1">{booking.opportunity.payment_details}</p>
              </div>
            )}
            {booking.opportunity.compensation_details && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Additional Compensation:</span>
                <p className="mt-1">{booking.opportunity.compensation_details}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Creator Section */}
      <CreatorSection 
        creator={creator}
        onChatClick={onChatClick}
        onViewCreator={onViewCreator}
      />
    </Card>
  );
};

export default BookingDetailsCard;