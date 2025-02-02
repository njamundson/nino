import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Creator } from "@/types/creator";

interface BookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: Creator) => void;
}

const BookingsList = ({ onChatClick, onViewCreator }: BookingsListProps) => {
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
              id,
              user_id,
              bio,
              location,
              instagram,
              website,
              specialties,
              creator_type,
              profile_image_url,
              display_name,
              created_at,
              updated_at,
              profile_id,
              notifications_enabled
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
    refetchInterval: 1000 * 60 * 5,
    retry: 3,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5
  });

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
        className="w-full max-w-5xl mx-auto"
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className={`grid ${
        isMobile 
          ? 'grid-cols-1 gap-4' 
          : 'md:grid-cols-2 lg:grid-cols-3 gap-6'
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
              onMessageClick={() => onChatClick(booking.creator.user_id)}
              onViewCreator={() => onViewCreator(booking.creator)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BookingsList;