import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CalendarX } from "lucide-react";
import BookingDetailsCard from "./BookingDetailsCard";

interface BrandBookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BrandBookingsList = ({ onChatClick, onViewCreator }: BrandBookingsListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: bookings, isLoading, refetch, isError } = useQuery({
    queryKey: ['brand-active-bookings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error fetching brand:', brandError);
          toast({
            title: "Error",
            description: "Failed to fetch brand profile",
            variant: "destructive",
          });
          return [];
        }

        if (!brand) {
          toast({
            title: "No Brand Profile",
            description: "Please complete your brand profile setup",
            variant: "destructive",
          });
          return [];
        }

        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities(*),
            creator:creators(*)
          `)
          .eq('status', 'accepted')
          .eq('opportunity.brand_id', brand.id)
          .in('opportunity.status', ['active', 'open']);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching brand bookings:', error);
        throw error;
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 3,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });

  const handleDelete = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const applicationsChannel = supabase
      .channel('bookings-applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
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

  if (isError) {
    return (
      <Card className="p-12 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Error loading bookings</p>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

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
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-nino-primary/10 p-4">
            <CalendarX className="h-8 w-8 text-nino-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-nino-text">No active bookings</h3>
            <p className="text-sm text-nino-gray max-w-sm">
              When you accept creator applications, they will appear here. Start exploring creators and creating opportunities to collaborate!
            </p>
          </div>
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