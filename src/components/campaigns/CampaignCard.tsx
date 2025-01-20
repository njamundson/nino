import { useState } from "react";
import ApplicationsList from "./ApplicationsList";
import CreatorProfileModal from "@/components/campaigns/modals/CreatorProfileModal";

interface CampaignCardProps {
  campaign: any;
  applications: any[];
  onEdit: (campaign: any) => void;
  onDelete: (campaignId: string) => void;
  onUpdateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const CampaignCard = ({ campaign, applications, onEdit, onDelete, onUpdateApplicationStatus }: CampaignCardProps) => {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = (application: any) => {
    setSelectedApplication(application);
    setShowCreatorProfile(true);
  };

  const handleMessageCreator = (userId: string) => {
    navigate(`/messages?userId=${userId}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold">{campaign.title}</h3>
        <p className="text-gray-600">{campaign.description}</p>
        <div className="flex justify-between mt-4">
          <button onClick={() => onEdit(campaign)} className="text-blue-500">Edit</button>
          <button onClick={() => onDelete(campaign.id)} className="text-red-500">Delete</button>
        </div>
      </div>

      <ApplicationsList
        applications={applications}
        onViewProfile={handleViewProfile}
        onMessageCreator={handleMessageCreator}
      />

      {showCreatorProfile && selectedApplication && (
        <CreatorProfileModal
          isOpen={showCreatorProfile}
          onClose={() => setShowCreatorProfile(false)}
          creator={selectedApplication.creator}
          coverLetter={selectedApplication.cover_letter}
          onUpdateStatus={(status) => onUpdateApplicationStatus(selectedApplication.id, status)}
          onMessageCreator={() => handleMessageCreator(selectedApplication.creator?.user_id)}
          opportunityId={campaign.id}
          applicationId={selectedApplication.id} // Pass the application ID
        />
      )}
    </div>
  );
};

export default CampaignCard;
