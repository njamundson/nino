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
  const brandProfileImage = application.opportunity?.brand?.profile_image_url;
  const compensationAmount = application.opportunity?.compensation_amount;
  const compensationType = application.opportunity?.compensation_type;

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
            profileImage={brandProfileImage}
            compensationAmount={compensationAmount}
            compensationType={compensationType}
          />

          {application.cover_letter && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {application.cover_letter}
              </p>
            </div>
          )}

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
          onAccept={() => onUpdateStatus(application.id, 'accepted')}
          onDecline={() => onUpdateStatus(application.id, 'rejected')}
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