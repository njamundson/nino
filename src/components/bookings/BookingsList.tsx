import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import BookingCard from './BookingCard';
import { useToast } from "@/hooks/use-toast";

interface BookingsListProps {
  onChatClick: (userId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BookingsList = ({ onChatClick, onViewCreator }: BookingsListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: bookings, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!creator) {
          return [];
        }

        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities(
              *,
              brand:brands(
                company_name
              )
            ),
            creator:creators(*)
          `)
          .eq('creator_id', creator.id)
          .eq('status', 'accepted')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        console.log('Fetched bookings:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
    }
  });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      refetch();
      toast({
        title: "Booking cancelled",
        description: "The booking has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: 'status=eq.accepted'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (!bookings || bookings.length === 0) {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 bg-white/50 backdrop-blur-sm border-none shadow-sm">
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg font-medium">No active bookings yet</p>
              <p className="text-sm mt-2">
                When you get accepted for projects, they will appear here
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`grid ${
          isMobile 
            ? 'grid-cols-1 gap-4' 
            : 'grid-cols-1 gap-6'
        }`}>
          {bookings.map((booking: any) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookingCard
                creator={booking.creator}
                opportunity={booking.opportunity}
                onMessageClick={() => onChatClick(booking.creator.user_id)}
                onViewCreator={() => onViewCreator(booking.creator)}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingsList;