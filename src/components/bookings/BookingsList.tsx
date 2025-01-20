import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";

interface BookingsListProps {
  bookings: any[];
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BookingsList = ({ bookings, onChatClick, onViewCreator }: BookingsListProps) => {
  // Filter to only show bookings from active campaigns
  const activeBookings = bookings.filter(booking => 
    booking.opportunity?.status === 'active'
  );

  if (!activeBookings || activeBookings.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground py-8">
          <p>No active bookings yet</p>
          <p className="text-sm mt-1">
            Your accepted applications for active campaigns will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {activeBookings.map((booking: any) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onChatClick={() => onChatClick(booking.creator.user_id)}
              onViewCreator={() => onViewCreator(booking.creator)}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default BookingsList;