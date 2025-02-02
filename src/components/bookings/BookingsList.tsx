import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  const { data: bookings, refetch, isLoading } = useQuery({
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
            opportunity:opportunities(*),
            creator:creators(*)
          `)
          .eq('creator_id', creator.id)
          .eq('status', 'accepted')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 -mt-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={loadingVariants}
          className="space-y-4"
        >
          {[1, 2, 3].map((index) => (
            <Card key={index} className="p-8 bg-white/50 backdrop-blur-sm border-none shadow-sm animate-pulse">
              <div className="h-24" />
            </Card>
          ))}
        </motion.div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="px-8 -mt-4">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <Card className="p-8 bg-white/50 backdrop-blur-sm border-none shadow-sm">
            <motion.div 
              className="text-center text-muted-foreground py-8"
              variants={itemVariants}
            >
              <p className="text-lg font-medium">No active bookings yet</p>
              <p className="text-sm mt-2">
                When you get accepted for projects, they will appear here
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-8 -mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="bookings-list"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className={`grid ${
            isMobile 
              ? 'grid-cols-1 gap-4' 
              : 'grid-cols-1 gap-6'
          }`}>
            {bookings.map((booking: any) => (
              <motion.div
                key={booking.id}
                variants={itemVariants}
                layout
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
      </AnimatePresence>
    </div>
  );
};

export default BookingsList;