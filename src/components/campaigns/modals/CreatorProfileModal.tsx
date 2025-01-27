import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreatorSocials } from "../card/creator/CreatorSocials";
import AcceptDialog from "./profile/AcceptDialog";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  coverLetter?: string;
  onMessageCreator?: () => void;
  onUpdateStatus?: () => Promise<boolean>;
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
    if (isProcessing) return;
    setShowAcceptDialog(true);
  };

  const handleAcceptConfirm = async () => {
    if (!onUpdateStatus || isProcessing) return;
    const success = await onUpdateStatus();
    if (success) {
      setShowAcceptDialog(false);
      onClose();
    }
  };

  const fullName = creator.first_name ? 
    `${creator.first_name} ${creator.last_name || ''}`.trim() : 
    'Creator';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-3xl">
          <div className="relative">
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                {creator.profile_image_url ? (
                  <img
                    src={creator.profile_image_url}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {fullName}
                  </h2>
                  
                  {creator.location && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{creator.location}</span>
                    </div>
                  )}
                </div>

                {creator.bio && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {creator.bio}
                    </p>
                  </div>
                )}

                {creator.specialties && creator.specialties.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-nino-primary/5 text-nino-primary border-nino-primary/20 hover:bg-nino-primary/10"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <CreatorSocials creator={creator} onMessageClick={onMessageCreator} />

                {coverLetter && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">Application Message</h3>
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {onUpdateStatus && (
                  <div className="flex gap-4 mt-auto pt-4">
                    <Button
                      onClick={onClose}
                      disabled={isProcessing}
                      variant="outline"
                      className="flex-1 border-2 border-nino-primary/20 text-nino-primary hover:bg-nino-primary/5 rounded-full py-6"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleAccept}
                      disabled={isProcessing}
                      className="flex-1 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-full py-6"
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