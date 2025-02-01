import { Card } from "@/components/ui/card";
import ProjectDetails from "./ProjectDetails";
import CompensationDetails from "./CompensationDetails";
import CreatorSection from "./CreatorSection";

interface BookingDetailsCardProps {
  creator: {
    id: string;
    first_name?: string;
    last_name?: string | null;
    profile_image_url: string | null;
    display_name: string;
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
      deliverables?: string[] | null;
      requirements?: string[] | null;
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
      {/* Campaign Details Section */}
      <ProjectDetails opportunity={booking.opportunity} />

      {/* Compensation Details Section */}
      <CompensationDetails
        payment_details={booking.opportunity.payment_details}
        compensation_details={booking.opportunity.compensation_details}
        deliverables={booking.opportunity.deliverables}
        requirements={booking.opportunity.requirements}
      />

      {/* Collapsible Creator Section */}
      <CreatorSection 
        creator={creator}
        onChatClick={onChatClick}
        onViewCreator={onViewCreator}
      />
    </Card>
  );
};

export default BookingDetailsCard;