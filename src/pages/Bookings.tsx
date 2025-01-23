import PageHeader from "@/components/shared/PageHeader";
import BookingsList from "@/components/bookings/BookingsList";
import { useToast } from "@/hooks/use-toast";

const Bookings = () => {
  const { toast } = useToast();

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
        onChatClick={handleChatClick}
        onViewCreator={handleViewCreator}
      />
    </div>
  );
};

export default Bookings;