import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CreatorProfile from "@/components/creators/modal/CreatorProfile";
import ApplicationMessage from "./profile/ApplicationMessage";
import AcceptDialog from "./profile/AcceptDialog";
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare } from "lucide-react";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onMessageCreator: () => void;
  opportunityId?: string;
  isProcessing?: boolean;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  coverLetter,
  onUpdateStatus,
  onMessageCreator,
  opportunityId,
  isProcessing = false
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAcceptConfirm = async () => {
    if (isProcessing) return;
    
    try {
      // Update the application status
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
      await queryClient.invalidateQueries({ queryKey: ['new-proposals'] });
      
      // Navigate after everything is done
      navigate('/brand/bookings');
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error("Failed to accept application. Please try again.");
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    
    try {
      onUpdateStatus('rejected');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Send rejection message to creator
      const { error: messageError } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: creator.user_id,
        content: `I've reviewed your application but unfortunately, we won't be moving forward at this time. Thank you for your interest!`,
        message_type: 'text'
      });

      if (messageError) throw messageError;

      // Success flow
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['new-proposals'] });
      
      toast.success("Application rejected");
      onClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error("Failed to reject application");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-3xl">
          <div className="flex flex-col space-y-6">
            <CreatorProfile
              creator={creator}
              onInviteClick={() => {}}
              onMessageClick={onMessageCreator}
            />
            
            <div className="px-6 pb-6 space-y-6">
              <ApplicationMessage coverLetter={coverLetter} />
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowAcceptDialog(true)}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {isProcessing ? (
                    <div className="animate-spin">⌛</div>
                  ) : (
                    <CheckSquare className="w-5 h-5 mr-2" />
                  )}
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing}
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50 py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <XSquare className="w-5 h-5 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={handleAcceptConfirm}
        creatorName={`${creator?.first_name || ''} ${creator?.last_name || ''}`.trim()}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default CreatorProfileModal;