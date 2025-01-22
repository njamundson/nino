import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ApplicationItem from "./ApplicationItem";
import CreatorProfileModal from "../modals/CreatorProfileModal";

interface ApplicationsListProps {
  applications: any[];
  onViewProfile: (application: any) => void;
  onMessageCreator: (userId: string) => void;
}

const ApplicationsList = ({ applications, onViewProfile, onMessageCreator }: ApplicationsListProps) => {
  const [showApplications, setShowApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Filter out rejected applications
  const activeApplications = applications.filter(app => app.status !== 'rejected');

  // If there are no active applications, don't render anything
  if (!activeApplications.length) return null;

  const handleViewProfile = (application: any) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleUpdateStatus = (status: 'accepted' | 'rejected') => {
    onViewProfile(selectedApplication);
    handleCloseModal();
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setShowApplications(!showApplications)}
      >
        <span className="font-medium">
          Applications ({activeApplications.length})
        </span>
        {showApplications ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {showApplications && (
        <div className="mt-4 space-y-4">
          {activeApplications.map((application) => (
            <ApplicationItem
              key={application.id}
              application={application}
              onViewProfile={() => handleViewProfile(application)}
              onMessageCreator={() => onMessageCreator(application.creator?.user_id)}
            />
          ))}
        </div>
      )}

      {selectedApplication && (
        <CreatorProfileModal
          isOpen={!!selectedApplication}
          onClose={handleCloseModal}
          creator={selectedApplication.creator}
          coverLetter={selectedApplication.cover_letter}
          onUpdateStatus={handleUpdateStatus}
          onMessageCreator={() => onMessageCreator(selectedApplication.creator?.user_id)}
        />
      )}
    </div>
  );
};

export default ApplicationsList;