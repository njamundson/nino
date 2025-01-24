import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import AcceptDialog from "./profile/AcceptDialog";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";
import CreatorBio from "@/components/creators/modal/profile/CreatorBio";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  coverLetter?: string;
  onMessageCreator?: () => void;
  onUpdateStatus?: (status: 'accepted' | 'rejected') => void;
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
  opportunityId,
  isProcessing
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  const handleAccept = () => {
    setShowAcceptDialog(true);
  };

  const handleAcceptConfirm = async () => {
    if (!onUpdateStatus) return;
    onUpdateStatus('accepted');
    setShowAcceptDialog(false);
    onClose();
  };

  const handleReject = async () => {
    if (!onUpdateStatus) return;
    onUpdateStatus('rejected');
    onClose();
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
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CreatorImage 
                  profileImageUrl={creator.profile_image_url} 
                  fullName={getDisplayName()} 
                />

                <div className="flex flex-col space-y-6">
                  <CreatorBio
                    bio={creator.bio}
                    specialties={creator.specialties}
                    location={creator.location}
                    instagram={creator.instagram}
                    website={creator.website}
                    onMessageClick={onMessageCreator}
                    coverLetter={coverLetter} // Pass the cover letter
                  />

                  {/* Action Buttons */}
                  {onUpdateStatus && (
                    <div className="flex gap-4 mt-6">
                      <Button
                        onClick={handleAccept}
                        disabled={isProcessing}
                        className="flex-1 bg-nino-primary hover:bg-nino-primary/90 text-white py-6 rounded-2xl"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={isProcessing}
                        variant="outline"
                        className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 py-6 rounded-2xl"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
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
