import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import BookingCard from "./BookingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface BrandBookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BrandBookingsList = ({ onChatClick, onViewCreator }: BrandBookingsListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['brand-active-bookings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!brand) return [];

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
        return data || [];
      } catch (error) {
        console.error('Error fetching brand bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  // Set up real-time subscription for booking updates
  useEffect(() => {
    const channel = supabase
      .channel('brand-booking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: 'status=eq.accepted'
        },
        () => {
          console.log('Brand booking update detected, refetching...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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