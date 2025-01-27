import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ApplicationItem from "./ApplicationItem";
import CreatorModal from "@/components/creators/CreatorModal";
import ApplicationsHeader from "./applications/ApplicationsHeader";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";
import ApplicationMessage from "../modals/profile/ApplicationMessage";

interface ApplicationsListProps {
  applications: any[];
  onViewProfile: (application: any) => void;
  onMessageCreator: (userId: string) => void;
  onUpdateApplicationStatus?: (applicationId: string, newStatus: 'accepted' | 'rejected') => Promise<boolean>;
}

const ApplicationsList = ({ 
  applications = [], 
  onViewProfile, 
  onMessageCreator,
  onUpdateApplicationStatus 
}: ApplicationsListProps) => {
  const [showApplications, setShowApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const { isProcessing, handleUpdateStatus } = useApplicationManagement();
  const navigate = useNavigate();

  if (!Array.isArray(applications)) {
    console.error('Invalid applications data:', applications);
    toast.error("Error loading applications");
    return null;
  }

  // Filter out rejected and invalid applications
  const activeApplications = applications.filter(app => {
    if (!app || typeof app !== 'object') {
      console.error('Invalid application object:', app);
      return false;
    }
    return ['pending', 'accepted'].includes(app.status);
  });

  if (!activeApplications.length) return null;

  const handleViewProfile = (application: any) => {
    if (!application || !application.creator) {
      console.error('Invalid application data for profile view:', application);
      toast.error("Error loading creator profile");
      return;
    }
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleStatusUpdate = async (status: 'accepted' | 'rejected', keepCampaignActive?: boolean) => {
    if (!selectedApplication) return false;
    
    const success = await handleUpdateStatus(
      selectedApplication.id,
      selectedApplication.opportunity_id,
      status,
      keepCampaignActive
    );

    if (success && status === 'accepted') {
      if (selectedApplication?.creator?.user_id) {
        navigate(`/brand/messages?userId=${selectedApplication.creator.user_id}`);
      }
    }

    return success;
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <ApplicationsHeader
        count={activeApplications.length}
        isExpanded={showApplications}
        onToggle={() => setShowApplications(!showApplications)}
      />

      {showApplications && (
        <div className="mt-4 space-y-4">
          {activeApplications.map((application) => (
            <ApplicationItem
              key={application.id}
              application={application}
              onViewProfile={() => handleViewProfile(application)}
              onMessageCreator={() => {
                if (application.creator?.user_id) {
                  onMessageCreator(application.creator.user_id);
                } else {
                  console.error('No creator user_id found:', application);
                  toast.error("Unable to message creator");
                }
              }}
              onUpdateStatus={async (status) => {
                if (onUpdateApplicationStatus) {
                  return await onUpdateApplicationStatus(application.id, status);
                }
                return false;
              }}
            />
          ))}
        </div>
      )}

      {selectedApplication && (
        <CreatorModal
          creator={selectedApplication.creator}
          isOpen={!!selectedApplication}
          onClose={handleCloseModal}
          coverLetter={selectedApplication.cover_letter}
          onUpdateStatus={handleStatusUpdate}
          isProcessing={isProcessing}
          onMessageCreator={() => {
            if (selectedApplication.creator?.user_id) {
              onMessageCreator(selectedApplication.creator.user_id);
            }
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsList;