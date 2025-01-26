import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import AcceptDialog from "./profile/AcceptDialog";
import { X } from "lucide-react";
import CreatorBio from "@/components/creators/modal/profile/CreatorBio";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";

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

  const fullName = `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 
    `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim() ||
    'Anonymous Creator';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-3xl">
          <div className="relative w-full">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="w-5 h-5" />
            </button>

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
                      className="flex-1 bg-[#F1F1F1] text-gray-600 hover:bg-gray-100 py-6 rounded-[32px]"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleAccept}
                      disabled={isProcessing}
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
    </>
  );
};

export default CreatorProfileModal;