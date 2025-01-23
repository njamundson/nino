import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import BookingsList from "@/components/bookings/BookingsList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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
          .eq('status', 'accepted');

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const handleChatClick = async (creatorId: string) => {
    try {
      // Navigate to messages with the creator
      window.location.href = `/messages?userId=${creatorId}`;
    } catch (error) {
      console.error('Error handling chat click:', error);
      toast({
        title: "Error",
        description: "Could not open chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewCreator = (creator: any) => {
    try {
      // Navigate to creator profile
      window.location.href = `/creators/${creator.id}`;
    } catch (error) {
      console.error('Error viewing creator:', error);
      toast({
        title: "Error",
        description: "Could not view creator profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bookings"
        description="Manage your upcoming and past bookings."
      />
      <BookingsList 
        bookings={bookings}
        onChatClick={handleChatClick}
        onViewCreator={handleViewCreator}
      />
    </div>
  );
};

export default Bookings;