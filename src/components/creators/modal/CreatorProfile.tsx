import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";
import { Application } from "@/integrations/supabase/types/opportunity";
import ActionButtons from "@/components/campaigns/modals/profile/ActionButtons";
import AcceptDialog from "@/components/campaigns/modals/profile/AcceptDialog";
import { useState } from "react";
import { useApplicationActions } from "@/hooks/useApplicationActions";
import { toast } from "sonner";

interface CreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
  application?: Application | null;
}

const CreatorProfile = ({ creator, onClose, onInviteClick, onMessageClick, application }: CreatorProfileProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const { handleAcceptApplication, handleRejectApplication, isProcessing } = useApplicationActions({
    opportunityId: application?.opportunity_id || '',
  });

  if (!creator) return null;

  const fullName = creator.first_name && creator.last_name 
    ? `${creator.first_name} ${creator.last_name}`
    : creator.first_name || 'Creator';

  const onAccept = () => {
    setShowAcceptDialog(true);
  };

  const onReject = async () => {
    if (!application?.id) return;
    const success = await handleRejectApplication(application.id);
    if (success) {
      toast.success("Application rejected successfully");
      onClose?.();
    }
  };

  const onConfirmAccept = async () => {
    if (!application?.id) return;
    const success = await handleAcceptApplication(application.id);
    if (success) {
      toast.success("Application accepted successfully");
      onClose?.();
    }
    setShowAcceptDialog(false);
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="md:max-h-[600px] overflow-hidden">
          <CreatorImage 
            profileImageUrl={creator.profile_image_url} 
            fullName={fullName} 
          />
        </div>
        <div className="space-y-4">
          <CreatorBio 
            bio={creator.bio}
            specialties={creator.specialties}
            location={creator.location}
            instagram={creator.instagram}
            website={creator.website}
            onMessageClick={onMessageClick}
            fullName={fullName}
          />
          <CreatorSocialLinks 
            instagram={creator.instagram}
            website={creator.website}
          />
        </div>
      </div>

      {application && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
            
            <div className="space-y-2">
              {application.opportunity && (
                <p className="text-sm text-gray-500">
                  Submitted for: {application.opportunity.title}
                </p>
              )}
              {application.cover_letter && (
                <div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {application.cover_letter}
                  </p>
                </div>
              )}
            </div>

            {application.status === 'pending' && (
              <ActionButtons
                onAccept={onAccept}
                onReject={onReject}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      )}

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={onConfirmAccept}
        creatorName={fullName}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default CreatorProfile;