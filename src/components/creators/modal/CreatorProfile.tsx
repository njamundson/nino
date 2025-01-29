import { useState } from "react";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";
import ActionButtons from "@/components/campaigns/modals/profile/ActionButtons";
import AcceptDialog from "@/components/campaigns/modals/profile/AcceptDialog";
import { CreatorData } from "@/types/creator";
import { toast } from "sonner";

interface CreatorProfileProps {
  creator: CreatorData;
  onClose?: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
}

const CreatorProfile = ({ creator, onClose, onInviteClick }: CreatorProfileProps) => {
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fullName = creator.firstName && creator.lastName 
    ? `${creator.firstName} ${creator.lastName}`
    : creator.firstName || 'Creator';

  const handleAccept = async () => {
    setIsAcceptDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    try {
      setIsProcessing(true);
      // Add your accept logic here
      toast.success("Application accepted successfully");
      onClose?.();
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error("Failed to accept application");
    } finally {
      setIsProcessing(false);
      setIsAcceptDialogOpen(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      // Add your reject logic here
      toast.success("Application rejected successfully");
      onClose?.();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-semibold text-gray-900 px-6 pt-6">
        {fullName}
      </h2>

      <div className="px-6">
        <CreatorImage 
          profileImageUrl={creator.profileImage} 
          fullName={fullName}
        />
      </div>

      <div className="px-6">
        <CreatorBio 
          bio={creator.bio}
          specialties={creator.specialties}
          location={creator.location}
          instagram={creator.instagram}
          website={creator.website}
        />
      </div>

      <div className="px-6 pb-6">
        <CreatorSocialLinks 
          instagram={creator.instagram}
          website={creator.website}
        />
        <div className="mt-6">
          <ActionButtons
            onAccept={handleAccept}
            onReject={handleReject}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      <AcceptDialog
        isOpen={isAcceptDialogOpen}
        onOpenChange={setIsAcceptDialogOpen}
        onConfirm={handleConfirmAccept}
        creatorName={fullName}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default CreatorProfile;