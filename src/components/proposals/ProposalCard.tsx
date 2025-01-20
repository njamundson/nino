import { Card } from "@/components/ui/card";
import { useState } from "react";
import ProposalActions from "./ProposalActions";
import InvitationModal from "./modals/InvitationModal";
import ApplicationDetailsModal from "./modals/ApplicationDetailsModal";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import ProposalCardHeader from "./card/ProposalCardHeader";

interface ProposalCardProps {
  application: any;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalCard = ({ application, onUpdateStatus, type }: ProposalCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";

  const handleAccept = () => {
    onUpdateStatus(application.id, 'accepted');
    setShowDetails(false);
  };

  const handleDecline = () => {
    onUpdateStatus(application.id, 'rejected');
    setShowDetails(false);
  };

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow duration-200">
        <div className="space-y-6">
          <ProposalCardHeader
            brandName={brandName}
            title={application.opportunity?.title}
            location={application.opportunity?.brand?.location}
            startDate={application.opportunity?.start_date}
            status={application.status}
          />

          <div className="flex items-center justify-end">
            <ProposalActions
              status={application.status}
              onUpdateStatus={(status) => onUpdateStatus(application.id, status)}
              onViewProposals={() => setShowDetails(true)}
              opportunityId={application.opportunity_id}
              type={type}
              onViewOpportunity={() => setShowApplicationModal(true)}
            />
          </div>
        </div>
      </Card>

      {type === 'proposal' ? (
        <InvitationModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          opportunity={application.opportunity}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      ) : (
        <ApplicationDetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          application={application}
        />
      )}

      {showApplicationModal && (
        <ViewApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          application={application}
        />
      )}
    </>
  );
};

export default ProposalCard;