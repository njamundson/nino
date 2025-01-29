import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplicationActions } from "@/hooks/useApplicationActions";
import AcceptDialog from "@/components/campaigns/modals/profile/AcceptDialog";

interface CreatorProfileProps {
  creator: any;
  onClose: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
  application?: any;
}

const CreatorProfile = ({ creator, onClose, onInviteClick, onMessageClick, application }: CreatorProfileProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const { handleAcceptApplication, handleRejectApplication, isProcessing } = useApplicationActions();

  if (!creator) return null;

  const handleAcceptClick = async () => {
    if (!application) return;
    setShowAcceptDialog(true);
  };

  const handleConfirmAccept = async () => {
    if (!application) return;
    
    const success = await handleAcceptApplication(application.id);
    if (success) {
      setShowAcceptDialog(false);
      onClose();
    }
  };

  const handleRejectClick = async () => {
    if (!application) return;
    
    const success = await handleRejectApplication(application.id);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <img src={creator.profile_image_url} alt={`${creator.first_name} ${creator.last_name}`} className="w-32 h-32 rounded-full" />
        <h2 className="text-xl font-semibold">{creator.first_name} {creator.last_name}</h2>
        <p className="text-sm text-gray-500">{creator.bio}</p>
      </div>

      {application && (
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={handleRejectClick}
            disabled={isProcessing}
          >
            Reject
          </Button>
          <Button
            onClick={handleAcceptClick}
            disabled={isProcessing}
          >
            Accept
          </Button>
        </div>
      )}

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={handleConfirmAccept}
        creatorName={creator.first_name}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default CreatorProfile;
