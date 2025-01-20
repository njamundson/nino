import { Button } from "@/components/ui/button";
import { Users, ExternalLink } from "lucide-react";

interface ProposalActionsProps {
  status: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onViewProposals: () => void;
  opportunityId: string;
  type: 'proposal' | 'application';
  onViewOpportunity?: () => void;
}

const ProposalActions = ({ 
  status, 
  onUpdateStatus, 
  onViewProposals,
  type,
  onViewOpportunity
}: ProposalActionsProps) => {
  if (type === 'proposal') {
    return (
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onViewProposals}
        >
          <Users className="w-4 h-4" />
          View Proposal
        </Button>
        
        {status === 'pending' && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => onUpdateStatus('accepted')}
              className="gap-2"
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onUpdateStatus('rejected')}
              className="gap-2"
            >
              Reject
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={onViewOpportunity}
    >
      View Opportunity
      <ExternalLink className="w-4 h-4" />
    </Button>
  );
};

export default ProposalActions;