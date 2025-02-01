import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import BrandBookingsList from "@/components/bookings/BrandBookingsList";
import { useNavigate } from "react-router-dom";

const BrandBookings = () => {
  const navigate = useNavigate();

  const handleChatClick = (creatorId: string) => {
    navigate(`/brand/messages?userId=${creatorId}`);
  };

  const handleViewCreator = (creator: any) => {
    // Store creator data in state if needed for modal
    // Open creator profile modal
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bookings"
        description="Manage your active creator collaborations and projects"
      />
      
      <div className="max-w-7xl mx-auto">
        <BrandBookingsList
          onChatClick={handleChatClick}
          onViewCreator={handleViewCreator}
        />
      </div>
    </div>
  );
};

export default BrandBookings;