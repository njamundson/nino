import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingHeader from "./BookingHeader";
import CreatorSection from "./CreatorSection";
import BookingDetails from "./BookingDetails";
import CancelBookingDialog from "./CancelBookingDialog";

interface BookingCardProps {
  booking: any;
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BookingCard = ({ booking, onChatClick, onViewCreator }: BookingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  const handleCancelBooking = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking has been cancelled successfully.",
      });
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <BookingHeader
        title={booking.opportunity.title}
        onChatClick={() => onChatClick(booking.creator.user_id)}
      />
      
      <CreatorSection
        creator={booking.creator}
        onViewCreator={() => onViewCreator(booking.creator)}
      />

      <BookingDetails
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        startDate={booking.opportunity.start_date}
        endDate={booking.opportunity.end_date}
        description={booking.opportunity.description}
        requirements={booking.opportunity.requirements}
        perks={booking.opportunity.perks}
      />

      <div className="mt-4">
        <button
          onClick={() => setShowCancelDialog(true)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Cancel Booking
        </button>
      </div>

      <CancelBookingDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelBooking}
      />
    </Card>
  );
};

export default BookingCard;