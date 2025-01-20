import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import ProposalStatusBadge from "./ProposalStatusBadge";
import ProposalActions from "./ProposalActions";
import ProposalMetadata from "./ProposalMetadata";
import InvitationModal from "./modals/InvitationModal";
import ApplicationDetailsModal from "./modals/ApplicationDetailsModal";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProposalCardProps {
  application: any;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalCard = ({ application, onUpdateStatus, type }: ProposalCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const { toast } = useToast();

  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";
  const brandInitial = brandName[0].toUpperCase();

  const handleAccept = () => {
    onUpdateStatus(application.id, 'accepted');
    setShowDetails(false);
  };

  const handleDecline = () => {
    onUpdateStatus(application.id, 'rejected');
    setShowDetails(false);
  };

  const handleDeleteProposal = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: "Proposal deleted",
        description: "Your proposal has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card 
        className="p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{brandInitial}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {application.opportunity?.title}
                </h3>
                <ProposalMetadata
                  name={brandName}
                  location={application.opportunity?.brand?.location}
                  startDate={application.opportunity?.start_date}
                />
              </div>
            </div>
            <ProposalStatusBadge status={application.status} />
          </div>

          <div className="flex items-center justify-end">
            <ProposalActions
              status={application.status}
              onUpdateStatus={(status) => onUpdateStatus(application.id, status)}
              onViewProposals={() => setShowDetails(true)}
              opportunityId={application.opportunity_id}
              type={type}
              onDeleteProposal={type === 'application' ? handleDeleteProposal : undefined}
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