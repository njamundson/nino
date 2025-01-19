import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import CampaignProposalsModal from "./CampaignProposalsModal";
import ProposalStatusBadge from "./ProposalStatusBadge";
import ProposalActions from "./ProposalActions";
import ProposalMetadata from "./ProposalMetadata";

interface ProposalCardProps {
  application: any;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalCard = ({ application, onUpdateStatus, type }: ProposalCardProps) => {
  const [showProposals, setShowProposals] = useState(false);

  const creatorName = application.creator?.profile?.first_name && application.creator?.profile?.last_name
    ? `${application.creator.profile.first_name} ${application.creator.profile.last_name}`
    : "Anonymous Creator";

  const creatorInitials = creatorName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow duration-200">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{type === 'proposal' ? brandName[0] : creatorInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {application.opportunity?.title}
                </h3>
                <ProposalMetadata
                  name={type === 'proposal' ? brandName : creatorName}
                  location={type === 'proposal' ? application.opportunity?.brand?.location : application.creator?.location}
                  startDate={application.opportunity?.start_date}
                />
              </div>
            </div>
            <ProposalStatusBadge status={application.status} />
          </div>

          {application.cover_letter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {type === 'proposal' ? 'Invitation Message' : 'Cover Letter'}
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {application.cover_letter}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              {application.opportunity?.payment_details && (
                <p className="text-sm text-gray-600">
                  💰 {application.opportunity.payment_details}
                </p>
              )}
              {application.opportunity?.compensation_details && (
                <p className="text-sm text-gray-600">
                  🎁 {application.opportunity.compensation_details}
                </p>
              )}
            </div>
            
            <ProposalActions
              status={application.status}
              onUpdateStatus={(status) => onUpdateStatus(application.id, status)}
              onViewProposals={() => setShowProposals(true)}
              opportunityId={application.opportunity_id}
              type={type}
            />
          </div>
        </div>
      </Card>

      <CampaignProposalsModal
        isOpen={showProposals}
        onOpenChange={setShowProposals}
        campaignId={application.opportunity_id}
        campaignTitle={application.opportunity?.title}
      />
    </>
  );
};

export default ProposalCard;