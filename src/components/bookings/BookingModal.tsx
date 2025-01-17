import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

interface BookingModalProps {
  booking: {
    id: string;
    created_at: string;
    opportunity: {
      title: string;
      start_date: string;
      brand: {
        company_name: string;
        location: string;
      };
    };
    creator: {
      id: string;
      bio: string;
      location: string;
      specialties: string[];
      profile: {
        first_name: string;
        last_name: string;
      };
      imageUrl: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ booking, isOpen, onClose }: BookingModalProps) => {
  const handleChat = () => {
    toast.info("Chat functionality coming soon!");
  };

  const handleCancel = () => {
    toast.info("Cancel functionality coming soon!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-nino-bg">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-semibold text-nino-text">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-white">
              <img
                src={booking.creator.imageUrl || "/placeholder.svg"}
                alt={`${booking.creator.profile.first_name} ${booking.creator.profile.last_name}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">
                {booking.creator.profile.first_name} {booking.creator.profile.last_name}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-nino-gray">
                <MapPin className="h-4 w-4" />
                {booking.creator.location}
              </div>
              {booking.creator.specialties && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {booking.creator.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/50 hover:bg-white"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Campaign</h4>
            <p className="text-nino-gray">{booking.opportunity.title}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Booking Date</h4>
            <div className="flex items-center gap-2 text-nino-gray">
              <Calendar className="h-4 w-4" />
              {format(new Date(booking.opportunity.start_date), "MMMM d, yyyy")}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <Button
              className="flex-1 gap-2 bg-nino-primary hover:bg-nino-primary/90"
              onClick={handleChat}
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Creator
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;