import { Card } from "@/components/ui/card";
import ProjectDetails from "./ProjectDetails";
import CreatorSection from "./CreatorSection";

interface BookingDetailsCardProps {
  creator: {
    id: string;
    first_name: string;
    last_name: string | null;
    profile_image_url: string | null;
  };
  booking: {
    id: string;
    opportunity: {
      id: string;
      title: string;
      status: string;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      payment_details: string | null;
      compensation_details: string | null;
    };
  };
  onChatClick: () => void;
  onViewCreator: () => void;
  onRefresh: () => void;
}

const BookingDetailsCard = ({
  creator,
  booking,
  onChatClick,
  onViewCreator,
  onRefresh,
}: BookingDetailsCardProps) => {
  return (
    <Card className="p-6 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm space-y-6">
      <ProjectDetails opportunity={booking.opportunity} />
      <CreatorSection 
        creator={creator}
        onChatClick={onChatClick}
        onViewCreator={onViewCreator}
      />
    </Card>
  );
};

export default BookingDetailsCard;