import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";
import CreatorBio from "@/components/creators/modal/profile/CreatorBio";
import CreatorSocialLinks from "@/components/creators/modal/profile/CreatorSocialLinks";
import ActionButtons from "./profile/ActionButtons";
import ApplicationMessage from "./profile/ApplicationMessage";
import AcceptDialog from "./profile/AcceptDialog";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onMessageCreator: () => void;
  opportunityId?: string;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  coverLetter,
  onUpdateStatus,
  onMessageCreator,
  opportunityId
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAcceptConfirm = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // First update the application status
      onUpdateStatus('accepted');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Send initial message to creator
      const { error: messageError } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: creator.user_id,
        content: `Hi! I've accepted your application. Let's discuss the next steps!`,
        message_type: 'text'
      });

      if (messageError) throw messageError;

      // Update opportunity status if needed
      if (opportunityId) {
        const { error: opportunityError } = await supabase
          .from('opportunities')
          .update({ status: 'active' })
          .eq('id', opportunityId);

        if (opportunityError) throw opportunityError;
      }

      // Success flow
      toast.success("Application accepted successfully");
      setShowAcceptDialog(false);
      onClose();
      
      // Invalidate queries before navigation
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      
      // Navigate after everything is done
      navigate('/brand/bookings');
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error("Failed to accept application. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      onUpdateStatus('rejected');
      
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('creator_id', creator.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      toast.success("Application rejected");
      onClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error("Failed to reject application");
    }
  };

  const fullName = `${creator?.profile?.first_name || ''} ${creator?.profile?.last_name || ''}`.trim();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-3xl">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <CreatorImage 
                profileImageUrl={creator?.profile_image_url} 
                fullName={fullName}
              />
              
              <div className="flex flex-col h-full space-y-6">
                <CreatorBio 
                  bio={creator?.bio}
                  location={creator?.location}
                  specialties={creator?.specialties}
                  instagram={creator?.instagram}
                  website={creator?.website}
                  onMessageClick={onMessageCreator}
                />

                <CreatorSocialLinks 
                  instagram={creator?.instagram}
                  website={creator?.website}
                />

                <ApplicationMessage coverLetter={coverLetter} />

                <ActionButtons
                  onAccept={() => setShowAcceptDialog(true)}
                  onReject={handleReject}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={handleAcceptConfirm}
        creatorName={fullName}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default CreatorProfileModal;