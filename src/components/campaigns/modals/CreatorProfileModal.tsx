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
  onMessageCreator,
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

  const getDisplayName = () => {
    if (creator.first_name) {
      return `${creator.first_name} ${creator.last_name || ''}`.trim();
    }
    if (creator.profile?.first_name) {
      return `${creator.profile.first_name} ${creator.profile.last_name || ''}`.trim();
    }
    return 'Anonymous Creator';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] p-6 overflow-hidden bg-white rounded-3xl">
          <div className="flex flex-col h-full max-h-[80vh]">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Creator Image */}
                <div className="relative w-full">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
                    <img
                      src={creator?.profile_image_url}
                      alt={getDisplayName()}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex flex-col space-y-6">
                  {/* Location */}
                  <p className="text-nino-gray flex items-center gap-2">
                    <span className="text-lg">📍</span> {creator?.location || "Location not specified"}
                  </p>

                  {/* Social Links */}
                  <CreatorSocials 
                    creator={creator} 
                    onMessageClick={onMessageCreator}
                  />

                  {/* About Section */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-nino-text">About</h3>
                    <p className="text-nino-text/90 leading-relaxed">
                      {creator?.bio || "No bio available"}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-nino-text">Specialties</h3>
                    <CreatorSpecialties specialties={creator?.specialties} />
                  </div>

                  {/* Application Message */}
                  {coverLetter && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-2">Application Message</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                onClick={handleReject}
                disabled={isProcessing || isRejecting}
                variant="outline"
                className="py-6 rounded-2xl"
              >
                <XSquare className="w-5 h-5 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => setShowAcceptDialog(true)}
                disabled={isProcessing || isRejecting}
                className="bg-black hover:bg-black/90 text-white py-6 rounded-2xl"
              >
                <CheckSquare className="w-5 h-5 mr-2" />
                Accept
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={handleAcceptConfirm}
        creatorName={getDisplayName()}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default CreatorProfileModal;
