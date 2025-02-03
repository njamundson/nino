import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import BookingDetailsCard from "./details/BookingDetailsCard";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BookedCreatorProfile from "./details/BookedCreatorProfile";
import { Creator } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

interface BrandBookingsListProps {
  onChatClick: (creatorId: string) => void;
  onViewCreator: (creator: any) => void;
}

const BrandBookingsList = ({ onChatClick, onViewCreator }: BrandBookingsListProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { data: bookings = [], isLoading, refetch, isError, error } = useQuery({
    queryKey: ['brand-active-bookings-list'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No authenticated user found');
          return [];
        }

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error fetching brand:', brandError);
          throw brandError;
        }

        if (!brand) {
          console.log('No brand profile found');
          return [];
        }

        console.log('Fetching active bookings for brand:', brand.id);
        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            *,
            applications!inner (
              *,
              creator:creators(*)
            )
          `)
          .eq('brand_id', brand.id)
          .eq('status', 'active')
          .eq('applications.status', 'accepted');

        if (error) {
          console.error('Error fetching active bookings:', error);
          throw error;
        }

        console.log('Fetched active bookings:', data);
        return data || [];
      } catch (error) {
        console.error('Error in bookings query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
    retry: 2,
    initialData: [],
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
        description: "Booking deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete the booking",
        variant: "destructive",
      });
    }
  };

  const handleViewCreator = (creator: any) => {
    const mappedCreator = mapCreatorData(creator);
    setSelectedCreator(mappedCreator);
    setIsProfileOpen(true);
  };

  const handleMessageCreator = (creatorId: string) => {
    setIsProfileOpen(false);
    onChatClick(creatorId);
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
          console.log('Applications change detected, refetching...');
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
          console.log('Opportunities change detected, refetching...');
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
      <Card className={`p-12 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm ${isMobile ? 'mx-0 p-6' : ''}`}>
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Error loading bookings</p>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${isMobile ? 'px-0' : ''}`}>
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className={`p-12 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm ${isMobile ? 'mx-0 p-6' : ''}`}>
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
    <>
      <div className={`space-y-6 ${isMobile ? 'px-0' : ''}`}>
        {bookings.map((booking: any) => (
          <BookingDetailsCard
            key={booking.id}
            booking={booking}
            creator={booking.applications[0]?.creator}
            onChatClick={() => onChatClick(booking.applications[0]?.creator.user_id)}
            onViewCreator={() => handleViewCreator(booking.applications[0]?.creator)}
            onRefresh={refetch}
            onDelete={() => handleDelete(booking.applications[0]?.id)}
          />
        ))}
      </div>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DialogTitle className="sr-only">Creator Profile</DialogTitle>
          <DialogDescription className="sr-only">
            View creator profile details
          </DialogDescription>
          {selectedCreator && (
            <BookedCreatorProfile
              creator={selectedCreator}
              onClose={() => setIsProfileOpen(false)}
              onMessageClick={() => selectedCreator.user_id && handleMessageCreator(selectedCreator.user_id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrandBookingsList;
