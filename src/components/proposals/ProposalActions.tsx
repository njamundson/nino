import { Button } from "@/components/ui/button";
import { Check, X, Users, ExternalLink } from "lucide-react";

interface ProposalActionsProps {
  status: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onViewProposals: () => void;
  opportunityId: string;
}

const ProposalActions = ({ 
  status, 
  onUpdateStatus, 
  onViewProposals,
  opportunityId 
}: ProposalActionsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onViewProposals}
      >
        <Users className="w-4 h-4" />
        View Proposals
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => window.open(`/opportunities/${opportunityId}`, '_blank')}
      >
        View Opportunity
        <ExternalLink className="w-4 h-4" />
      </Button>
      
      {status === 'pending' && (
        <>
          <Button
            variant="default"
            size="sm"
            onClick={() => onUpdateStatus('accepted')}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Accept
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onUpdateStatus('rejected')}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Reject
          </Button>
        </>
      )}
    </div>
  );
};

export default ProposalActions;