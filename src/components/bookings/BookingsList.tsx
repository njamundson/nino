import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";

interface BookingsListProps {
  bookings: any[];
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BookingsList = ({ bookings, onChatClick, onViewCreator }: BookingsListProps) => {
  return (
    <Card className="p-8">
      <ScrollArea className="h-[600px] pr-4">
        {bookings && bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onChatClick={() => onChatClick(booking.creator.id)}
                onViewCreator={() => onViewCreator(booking.creator)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No confirmed bookings yet</p>
            <p className="text-sm mt-1">
              Your accepted applications will appear here
            </p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default BookingsList;