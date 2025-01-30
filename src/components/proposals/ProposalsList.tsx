import { Application } from "@/integrations/supabase/types/application";
import ProposalCard from "./ProposalCard";

interface ProposalsListProps {
  applications: Application[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalsList = ({ applications, isLoading, onUpdateStatus, type }: ProposalsListProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (applications.length === 0) {
    return <div>No applications found.</div>;
  }

  return (
    <div className="grid gap-6">
      {applications.map((application) => (
        <ProposalCard
          key={application.id}
          application={application}
          type={type}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default ProposalsList;
