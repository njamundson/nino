import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import AcceptDialog from "./profile/AcceptDialog";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";
import { X } from "lucide-react";

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
        <DialogContent className="max-w-[800px] p-0 overflow-hidden bg-white rounded-3xl">
          <div className="relative flex flex-col h-full min-h-[600px]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 flex flex-col flex-grow">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-900">
                  {getDisplayName()}
                </h2>
                {creator.location && (
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <span className="text-xl">📍</span>
                    <span>{creator.location}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                <CreatorImage 
                  profileImageUrl={creator.profile_image_url} 
                  fullName={getDisplayName()} 
                />

                <div className="flex flex-col space-y-6">
                  {/* About Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {creator.bio || "No bio available"}
                    </p>
                  </div>

                  {/* Application Message Section */}
                  {coverLetter && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Application Message</h3>
                      <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                          {coverLetter}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {onUpdateStatus && (
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handleReject}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 bg-[#F1F1F1] text-gray-600 hover:bg-gray-100 py-6 rounded-[32px] transition-all duration-300"
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