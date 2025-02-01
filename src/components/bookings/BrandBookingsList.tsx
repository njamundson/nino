import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingDetailsCard from "./BookingDetailsCard";
import { Creator } from "@/types/creator";

interface BrandBookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: Creator) => void;
}

const BrandBookingsList = ({ onChatClick, onViewCreator }: BrandBookingsListProps) => {
  const { toast } = useToast();

  const { data: bookings, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, creator:creators(*), opportunity:opportunities(*)");

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;
      
      refetch();
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete the campaign",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {bookings?.map((booking) => (
        <BookingDetailsCard
          key={booking.id}
          booking={booking}
          creator={booking.creator}
          onChatClick={() => onChatClick(booking.creator.user_id)}
          onViewCreator={() => onViewCreator(booking.creator)}
          onRefresh={refetch}
          onDelete={() => handleDelete(booking.id)}
        />
      ))}
    </div>
  );
};

export default BrandBookingsList;