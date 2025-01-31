import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";
import { Application } from "@/integrations/supabase/types/application";
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
    <div className="h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 h-full">
        <div className="relative h-full">
          <CreatorImage 
            profileImageUrl={creator.profile_image_url} 
            fullName={fullName} 
          />
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex-grow space-y-6">
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

          {application && (
            <div className="mt-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                
                <div className="space-y-2">
                  {application.opportunity?.title && (
                    <p className="text-sm text-gray-500">
                      Submitted for: {application.opportunity.title}
                    </p>
                  )}
                  {application.status === 'invited' ? (
                    <p className="text-sm text-gray-600">
                      This creator has been invited to apply
                    </p>
                  ) : application.cover_letter ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {application.cover_letter}
                      </p>
                    </div>
                  ) : null}
                </div>

                {application.status === 'pending' && (
                  <div className="pt-2">
                    <ActionButtons
                      onAccept={onAccept}
                      onReject={onReject}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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