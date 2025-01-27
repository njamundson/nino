import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import AcceptDialog from "./profile/AcceptDialog";
import CreatorBio from "@/components/creators/modal/profile/CreatorBio";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";
import SuccessModal from "@/components/campaign/SuccessModal";
import { toast } from "sonner";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  coverLetter?: string;
  onMessageCreator?: () => void;
  onUpdateStatus?: (status: 'accepted' | 'rejected', keepCampaignActive?: boolean) => Promise<boolean>;
  opportunityId?: string;
  isProcessing?: boolean;
}

const CreatorProfileModal = ({
  isOpen,
  onClose,
  creator,
  coverLetter,
  onMessageCreator,
  onUpdateStatus,
  isProcessing
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAccept = () => {
    setShowAcceptDialog(true);
  };

  const handleAcceptConfirm = async () => {
    if (!onUpdateStatus) return;
    
    setShowAcceptDialog(false);
    const success = await onUpdateStatus('accepted');
    
    if (success) {
      setShowSuccessModal(true);
    }
  };

  const handleKeepActive = async () => {
    if (!onUpdateStatus) return;
    
    const success = await onUpdateStatus('accepted', true);
    if (success) {
      setShowSuccessModal(false);
      onClose();
      toast.success("Application accepted and campaign kept active");
      if (onMessageCreator) {
        onMessageCreator();
      }
    }
  };

  const handleCloseProject = async () => {
    if (!onUpdateStatus) return;
    
    const success = await onUpdateStatus('accepted', false);
    if (success) {
      setShowSuccessModal(false);
      onClose();
      toast.success("Application accepted and campaign closed");
      if (onMessageCreator) {
        onMessageCreator();
      }
    }
  };

  const handleReject = async () => {
    if (!onUpdateStatus) return;
    
    const success = await onUpdateStatus('rejected');
    if (success) {
      onClose();
      toast.success("Application rejected");
    }
  };

  const fullName = creator.first_name ? 
    `${creator.first_name} ${creator.last_name || ''}`.trim() : 
    'Creator';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-3xl">
          <DialogTitle className="sr-only">Creator Profile</DialogTitle>
          <div className="relative w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-nino-text">
                  {fullName}
                </h2>
                <CreatorImage 
                  profileImageUrl={creator.profile_image_url} 
                  fullName={fullName}
                />
              </div>

              <div className="flex flex-col h-full space-y-6">
                <CreatorBio
                  bio={creator.bio}
                  location={creator.location}
                  specialties={creator.specialties}
                  instagram={creator.instagram}
                  website={creator.website}
                  onMessageClick={onMessageCreator}
                  coverLetter={coverLetter}
                />

                {onUpdateStatus && (
                  <div className="flex gap-4 mt-auto">
                    <Button
                      onClick={handleReject}
                      disabled={isProcessing}
                      type="button"
                      className="flex-1 bg-[#F1F1F1] text-gray-600 hover:bg-gray-100 py-6 rounded-[32px]"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleAccept}
                      disabled={isProcessing}
                      type="button"
                      className="flex-1 bg-nino-primary hover:bg-nino-primary/90 text-white py-6 rounded-[32px]"
                    >
                      Accept
                    </Button>
                  </div>
                )}
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

      <SuccessModal
        isOpen={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        onKeepActive={handleKeepActive}
        onClose={handleCloseProject}
      />
    </>
  );
};

export default CreatorProfileModal;