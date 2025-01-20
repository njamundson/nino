import { Button } from "@/components/ui/button";
import { Users, ExternalLink, Trash2 } from "lucide-react";

interface ProposalActionsProps {
  status: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onViewProposals: () => void;
  opportunityId: string;
  type: 'proposal' | 'application';
  onDeleteProposal?: () => void;
  onViewOpportunity?: () => void;
}

const ProposalActions = ({ 
  status, 
  onUpdateStatus, 
  onViewProposals,
  opportunityId,
  type,
  onDeleteProposal,
  onViewOpportunity
}: ProposalActionsProps) => {
  return (
    <div className="flex gap-3">
      {type === 'proposal' ? (
        <>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onViewProposals}
          >
            <Users className="w-4 h-4" />
            View Proposals
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
        </>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onViewOpportunity}
          >
            View Opportunity
            <ExternalLink className="w-4 h-4" />
          </Button>
          {onDeleteProposal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteProposal}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProposalActions;