import { Application } from "@/integrations/supabase/types/opportunity";
import { formatDistanceToNow } from "date-fns";
import ProposalStatusBadge from "../ProposalStatusBadge";

interface ProposalCardHeaderProps {
  application: Application;
}

const ProposalCardHeader = ({ application }: ProposalCardHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {application.opportunity?.title || "Untitled Opportunity"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {application.opportunity?.brand?.company_name || "Unknown Brand"}
        </p>
      </div>
      <ProposalStatusBadge status={application.status} />
    </div>
  );
};

export default ProposalCardHeader;
