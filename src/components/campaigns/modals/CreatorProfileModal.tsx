import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import AcceptDialog from "./profile/AcceptDialog";
import { CreatorSpecialties } from "@/components/campaigns/card/creator/CreatorSpecialties";
import { CreatorSocials } from "@/components/campaigns/card/creator/CreatorSocials";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  coverLetter?: string;
  onMessageCreator?: () => void;
}

const CreatorProfileModal = ({
  isOpen,
  onClose,
  creator,
  onAccept,
  onReject,
  coverLetter,
  onMessageCreator,
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = () => {
    setShowAcceptDialog(true);
  };

  const handleAcceptConfirm = async () => {
    if (!onAccept) return;
    
    setIsProcessing(true);
    try {
      await onAccept();
      setShowAcceptDialog(false);
      onClose();
    } catch (error) {
      console.error('Error accepting application:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    setIsProcessing(true);
    try {
      await onReject();
      onClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setIsProcessing(false);
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
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-nino-text">Application Message</h3>
                      <p className="text-nino-text/90 leading-relaxed">
                        {coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(onAccept || onReject) && (
                    <div className="flex gap-4 mt-6">
                      {onAccept && (
                        <Button
                          onClick={handleAccept}
                          disabled={isProcessing}
                          className="flex-1 bg-nino-primary hover:bg-nino-primary/90"
                        >
                          Accept
                        </Button>
                      )}
                      {onReject && (
                        <Button
                          onClick={handleReject}
                          disabled={isProcessing}
                          variant="outline"
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      )}
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