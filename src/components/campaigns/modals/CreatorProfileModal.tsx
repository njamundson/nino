import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import AcceptDialog from "./profile/AcceptDialog";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";
import CreatorBio from "@/components/creators/modal/profile/CreatorBio";
import CreatorProfile from "@/components/creators/modal/CreatorProfile";

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
  const [showFullProfile, setShowFullProfile] = useState(false);

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
              {showFullProfile ? (
                <CreatorProfile
                  creator={creator}
                  onInviteClick={() => setShowFullProfile(false)}
                  onMessageClick={onMessageCreator}
                />
              ) : (
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
                      coverLetter={coverLetter}
                    />

                    {/* Action Buttons */}
                    {onUpdateStatus && (
                      <div className="flex flex-col gap-4 mt-6">
                        <Button
                          onClick={() => setShowFullProfile(true)}
                          variant="outline"
                          className="w-full bg-[#FFFFFF] hover:bg-[#F9F6F2] text-[#282828] border-2 border-[#A55549]/20 py-6 rounded-2xl transition-all duration-300"
                        >
                          View Profile
                        </Button>
                        <div className="flex gap-4">
                          <Button
                            onClick={handleAccept}
                            disabled={isProcessing}
                            className="flex-1 bg-[#A55549] hover:bg-[#A55549]/90 text-[#FFFFFF] py-6 rounded-2xl transition-all duration-300"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={handleReject}
                            disabled={isProcessing}
                            variant="outline"
                            className="flex-1 bg-[#FFFFFF] hover:bg-[#F9F6F2] text-[#282828] border-2 border-[#A55549] py-6 rounded-2xl transition-all duration-300"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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