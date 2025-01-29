import { Card } from "@/components/ui/card";
import BookingDetailsCard from "./BookingDetailsCard";
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
    const applicationsChannel = supabase
      .channel('bookings-applications')
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

    const opportunitiesChannel = supabase
      .channel('bookings-opportunities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(opportunitiesChannel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="p-12 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No active bookings yet</p>
          <p className="text-sm">
            When you accept creator applications, they will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking: any) => (
        <BookingDetailsCard
          key={booking.id}
          booking={booking}
          onChatClick={() => onChatClick(booking.creator.user_id)}
          onViewCreator={() => onViewCreator(booking.creator)}
          onRefresh={refetch}
        />
      ))}
    </div>
  );
};

export default BrandBookingsList;