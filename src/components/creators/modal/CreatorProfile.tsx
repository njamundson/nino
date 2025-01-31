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
    <div className="flex flex-col h-full">
      <div className="p-6 flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6">
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
          </div>
        </div>

        {application && (
          <div className="mt-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
              
              <div className="space-y-3">
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
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap bg-white rounded-lg p-4 border border-gray-100">
                      {application.cover_letter}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons outside the scrollable area */}
      {(application?.status === 'pending' || application?.status === 'invited') && (
        <div className="p-6 border-t border-gray-100 mt-auto">
          <div className="flex justify-between gap-4">
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="flex-1 px-8 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-medium 
                       hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
            >
              Reject
            </button>
            <button
              onClick={onAccept}
              disabled={isProcessing}
              className="flex-1 px-8 py-3 rounded-full bg-nino-primary text-white font-medium 
                       hover:bg-nino-primary/90 active:scale-[0.98] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-nino-primary focus:ring-offset-2"
            >
              Accept
            </button>
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