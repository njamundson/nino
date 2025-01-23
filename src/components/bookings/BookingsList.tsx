import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingsListProps {
  bookings: any[];
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BookingsList = ({ bookings = [], onChatClick, onViewCreator }: BookingsListProps) => {
  const isMobile = useIsMobile();
  
  // Filter to only show bookings from active campaigns
  const activeBookings = bookings?.filter(booking => 
    booking?.opportunity?.status === 'active' || booking?.opportunity?.status === 'open'
  ) || [];

  if (!bookings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (activeBookings.length === 0) {
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
    <div className="space-y-6">
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {activeBookings.map((booking: any) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onChatClick={() => onChatClick(booking.creator.user_id)}
            onViewCreator={() => onViewCreator(booking.creator)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingsList;