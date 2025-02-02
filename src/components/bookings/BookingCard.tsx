import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { Calendar, MapPin, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BookingCardProps {
  creator: Creator;
  opportunity: {
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
  } | null;
  onMessageClick: () => void;
  onViewCreator: () => void;
}

const BookingCard = ({ creator, opportunity, onMessageClick, onViewCreator }: BookingCardProps) => {
  if (!opportunity) {
    return null;
  }

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer p-6 space-y-6">
      {/* Status Badge */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {opportunity.title}
          </h3>
          <Badge 
            variant="secondary" 
            className="bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
          >
            Active Booking
          </Badge>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        {opportunity.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {opportunity.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
          {(opportunity.start_date || opportunity.end_date) && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {opportunity.start_date && formatDate(opportunity.start_date)}
                {opportunity.start_date && opportunity.end_date && " - "}
                {opportunity.end_date && formatDate(opportunity.end_date)}
              </span>
            </div>
          )}

          {opportunity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{opportunity.location}</span>
            </div>
          )}
        </div>

        {/* Compensation Details */}
        <div className="flex flex-wrap gap-2">
          {opportunity.payment_details && (
            <Badge variant="outline" className="rounded-full border-gray-200">
              💰 {opportunity.payment_details}
            </Badge>
          )}
          {opportunity.compensation_details && (
            <Badge variant="outline" className="rounded-full border-gray-200">
              🎁 {opportunity.compensation_details}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={onMessageClick}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Message Brand
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewCreator}
          className="border-gray-200 hover:bg-gray-50"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default BookingCard;