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
    booking.opportunity?.status === 'active' || booking.opportunity?.status === 'open'
  );

  if (!activeBookings || activeBookings.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground py-8">
          <p className="text-lg font-medium">No active bookings yet</p>
          <p className="text-sm mt-2">
            When you accept creator applications, they will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-nino-text">Active Bookings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your active collaborations and communicate with creators
        </p>
      </div>

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