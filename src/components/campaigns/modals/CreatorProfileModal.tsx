import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AcceptDialog from "./profile/AcceptDialog";
import ApplicationMessage from "./profile/ApplicationMessage";
import { CreatorInfo } from "../card/creator/CreatorInfo";
import { CreatorSocials } from "../card/creator/CreatorSocials";
import { CreatorSpecialties } from "../card/creator/CreatorSpecialties";

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
  opportunityId,
  isProcessing = false
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAcceptConfirm = async () => {
    if (isProcessing) return;
    
    try {
      onUpdateStatus('accepted');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: messageError } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: creator.user_id,
        content: `Hi! I've accepted your application. Let's discuss the next steps!`,
        message_type: 'text'
      });

      if (messageError) throw messageError;

      if (opportunityId) {
        const { error: opportunityError } = await supabase
          .from('opportunities')
          .update({ status: 'active' })
          .eq('id', opportunityId);

        if (opportunityError) throw opportunityError;
      }

      toast.success("Application accepted successfully");
      setShowAcceptDialog(false);
      onClose();
      
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['new-proposals'] });
      
      navigate('/brand/bookings');
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error("Failed to accept application");
    }
  };

  const handleReject = async () => {
    if (isProcessing || isRejecting) return;
    
    try {
      setIsRejecting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: messageError } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: creator.user_id,
        content: `I've reviewed your application but unfortunately, we won't be moving forward at this time. Thank you for your interest!`,
        message_type: 'text'
      });

      if (messageError) throw messageError;

      onUpdateStatus('rejected');
      onClose();

      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['new-proposals'] });
      
      toast.success("Application rejected");
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error("Failed to reject application");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] p-0 overflow-hidden bg-white rounded-3xl">
          <DialogTitle className="text-2xl font-semibold p-6 pb-0">
            <CreatorInfo creator={creator} />
          </DialogTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Creator Image */}
            <div className="relative w-full">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
                <img
                  src={creator?.profile_image_url}
                  alt={creator?.first_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex flex-col space-y-6">
              <CreatorSocials creator={creator} />

              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-nino-text">About</h3>
                <p className="text-base leading-relaxed text-nino-text/90">
                  {creator?.bio || "No bio available"}
                </p>
              </div>

              {/* Specialties */}
              {creator?.specialties?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
                  <CreatorSpecialties specialties={creator.specialties} />
                </div>
              )}

              {/* Application Message */}
              <ApplicationMessage coverLetter={coverLetter} />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowAcceptDialog(true)}
                  disabled={isProcessing || isRejecting}
                  className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CheckSquare className="w-5 h-5 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing || isRejecting}
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
        creatorName={creator?.first_name || 'Creator'}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default CreatorProfileModal;