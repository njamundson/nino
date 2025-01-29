import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

interface BrandBookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BrandBookingsList = ({ onChatClick, onViewCreator }: BrandBookingsListProps) => {
  const isMobile = useIsMobile();
  
  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['brand-active-bookings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!brand) throw new Error('No brand found');

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
          .eq('status', 'accepted')
          .eq('opportunity.brand_id', brand.id)
          .in('opportunity.status', ['active', 'open']);

        if (error) throw error;
        console.log('Fetched bookings:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching brand bookings:', error);
        throw error;
      }
    },
  });

  // Set up real-time subscription for booking updates
  useEffect(() => {
    const applicationsChannel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: 'status=eq.accepted'
        },
        (payload) => {
          console.log('Application update detected:', payload);
          refetch();
        }
      )
      .subscribe();

    const opportunitiesChannel = supabase
      .channel('opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities'
        },
        (payload) => {
          console.log('Opportunity update detected:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(opportunitiesChannel);
    };
  }, [refetch]);

  if (error) {
    toast.error("Failed to load bookings. Please try again.");
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground py-8">
          <p className="text-lg font-medium">Error loading bookings</p>
          <p className="text-sm mt-2">Please refresh the page to try again</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
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
        {bookings.map((booking: any) => (
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

export default BrandBookingsList;