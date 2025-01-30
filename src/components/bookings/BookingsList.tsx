import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface BookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
  isCreatorView?: boolean;
}

const BookingsList = ({ 
  onChatClick, 
  onViewCreator, 
  isCreatorView = true 
}: BookingsListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: bookings, refetch } = useQuery({
    queryKey: ['active-bookings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!creator) return [];

        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities(*),
            creator:creators(
              *,
              profile:profiles(*)
            )
          `)
          .eq('creator_id', creator.id)
          .eq('status', 'accepted')
          .in('opportunity.status', ['active', 'open']);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 3,
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
    gcTime: 1000 * 60 * 5 // Keep unused data in cache for 5 minutes
  });

  // Set up real-time subscription for booking updates
  useEffect(() => {
    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: 'status=eq.accepted'
        },
        (payload) => {
          console.log('Booking update detected:', payload);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8">
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg font-medium">No active bookings yet</p>
            <p className="text-sm mt-2">
              When you get accepted for projects, they will appear here
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {bookings.map((booking: any) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onChatClick={() => onChatClick(booking.creator.user_id)}
            onViewCreator={() => onViewCreator(booking.creator)}
            isCreatorView={isCreatorView}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BookingsList;