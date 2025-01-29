import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import BrandBookingsList from "@/components/bookings/BrandBookingsList";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BrandBookings = () => {
  const navigate = useNavigate();

  const handleChatClick = (creatorId: string) => {
    if (!creatorId) {
      toast.error("Unable to start chat. Creator information is missing.");
      return;
    }
    navigate(`/brand/messages?userId=${creatorId}`);
  };

  const handleViewCreator = (creator: any) => {
    if (!creator) {
      toast.error("Creator information is missing.");
      return;
    }
    // You can implement a modal or navigate to creator profile
    // For now, we'll just show creator info in a toast
    toast.success(`Viewing ${creator.first_name} ${creator.last_name}'s profile`);
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