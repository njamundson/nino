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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProjectDetails from "./details/ProjectDetails";
import CompensationDetails from "./details/CompensationDetails";
import CreatorSection from "./details/CreatorSection";
import BookedCreatorProfile from "./details/BookedCreatorProfile";

interface BookingDetailsCardProps {
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
    creator: {
      bio: string | null;
      specialties: string[] | null;
      first_name: string;
      last_name: string | null;
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

  const handleCancelBooking = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: `The booking with ${booking.creator.first_name} ${booking.creator.last_name || ''} has been cancelled. They will be notified of this change.`,
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

  const modalCreator = {
    id: booking.creator.id,
    bio: booking.creator.bio || '',
    location: booking.creator.location || '',
    specialties: booking.creator.specialties || [],
    instagram: booking.creator.instagram || '',
    website: booking.creator.website || '',
    first_name: booking.creator.first_name,
    last_name: booking.creator.last_name || '',
    profile_image_url: booking.creator.profile_image_url,
    creator_type: (booking.creator.creator_type as CreatorType) || 'solo',
    user_id: booking.creator.user_id,
    created_at: booking.created_at,
    updated_at: booking.created_at,
    profile_id: null
  };

  return (
    <>
      <Card className="overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300">
        <div className="p-6 space-y-6">
          <ProjectDetails opportunity={booking.opportunity} />
          
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
      <Dialog
        open={showCreatorModal}
        onOpenChange={setShowCreatorModal}
      >
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <BookedCreatorProfile
            creator={modalCreator}
            onClose={() => setShowCreatorModal(false)}
            onMessageClick={() => onChatClick(booking.creator.user_id)}
            onCancelBooking={() => {
              setShowCreatorModal(false);
              setShowCancelDialog(true);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingDetailsCard;