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
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <PageHeader
        title="Bookings"
        description="Manage your active creator collaborations and projects"
      />
      
      <div className="mt-6">
        <BrandBookingsList
          onChatClick={handleChatClick}
          onViewCreator={handleViewCreator}
        />
      </div>
    </motion.div>
  );
};

export default BrandBookings;