import { Card } from "@/components/ui/card";
import { CreatorType } from "@/types/creator";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreatorModal from "@/components/creators/CreatorModal";
import ProjectDetails from "./details/ProjectDetails";
import CompensationDetails from "./details/CompensationDetails";
import CreatorSection from "./details/CreatorSection";

interface BookingDetailsCardProps {
  booking: {
    id: string;
    opportunity: {
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
    creator: {
      bio: string | null;
      specialties: string[] | null;
      profile: {
        first_name: string | null;
        last_name: string | null;
      } | null;
      profile_image_url: string | null;
      user_id: string;
      id: string;
      instagram: string | null;
      website: string | null;
      location: string | null;
      creator_type: string | null;
    };
    created_at: string;
  };
  onChatClick: (userId: string) => void;
  onViewCreator: (creator: any) => void;
  onRefresh?: () => void;
}

const BookingDetailsCard = ({ booking, onChatClick, onViewCreator, onRefresh }: BookingDetailsCardProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const { toast } = useToast();
  
  const creatorName = booking.creator.profile ? 
    `${booking.creator.profile.first_name} ${booking.creator.profile.last_name}` : 
    'Anonymous Creator';

  const handleCancelBooking = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: `The booking with ${creatorName} has been cancelled. They will be notified of this change.`,
      });

      setShowCancelDialog(false);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Transform booking.creator into the format expected by CreatorModal
  const modalCreator = {
    id: booking.creator.id,
    bio: booking.creator.bio || '',
    location: booking.creator.location || '',
    specialties: booking.creator.specialties || [],
    instagram: booking.creator.instagram || '',
    website: booking.creator.website || '',
    first_name: booking.creator.profile?.first_name || '',
    last_name: booking.creator.profile?.last_name || '',
    profile_image_url: booking.creator.profile_image_url,
    creator_type: (booking.creator.creator_type as CreatorType) || 'solo'
  };

  return (
    <>
      <Card className="overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300">
        <div className="p-6 space-y-6">
          <ProjectDetails opportunity={booking.opportunity} onRefresh={onRefresh} />
          
          <CompensationDetails 
            payment_details={booking.opportunity.payment_details}
            compensation_details={booking.opportunity.compensation_details}
            deliverables={booking.opportunity.deliverables}
            requirements={booking.opportunity.requirements}
          />

          <CreatorSection 
            creator={booking.creator}
            onChatClick={() => onChatClick(booking.creator.user_id)}
            onViewCreator={() => setShowCreatorModal(true)}
            onCancelClick={() => setShowCancelDialog(true)}
          />
        </div>

        {/* Cancel Booking Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this project? The creator will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                className="bg-destructive hover:bg-destructive/90"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>

      {/* Creator Profile Modal */}
      <CreatorModal
        creator={modalCreator}
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
      />
    </>
  );
};

export default BookingDetailsCard;