import { Card } from "@/components/ui/card";
import ProjectDetails from "./details/ProjectDetails";
import CompensationDetails from "./details/CompensationDetails";
import CreatorSection from "./details/CreatorSection";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface BookingCardProps {
  booking: any;
  onChatClick: () => void;
  onViewCreator: () => void;
  isCreatorView?: boolean;
}

const BookingCard = ({ 
  booking, 
  onChatClick, 
  onViewCreator,
  isCreatorView = false 
}: BookingCardProps) => {
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsCreator(user?.id === booking.creator?.user_id);
    };
    
    checkUser();
  }, [booking.creator?.user_id]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-6">
        <ProjectDetails opportunity={booking.opportunity} />
        
        <CompensationDetails
          payment_details={booking.opportunity.payment_details}
          compensation_details={booking.opportunity.compensation_details}
          deliverables={booking.opportunity.deliverables}
          requirements={booking.opportunity.requirements}
        />

        {!isCreatorView && (
          <CreatorSection
            creator={booking.creator}
            onChatClick={onChatClick}
            onViewCreator={onViewCreator}
            onCancelClick={() => {
              // Handle cancellation logic
              console.log("Cancel booking:", booking.id);
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default BookingCard;