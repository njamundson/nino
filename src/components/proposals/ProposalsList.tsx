import { Application } from "@/integrations/supabase/types/application";
import ProposalCard from "./ProposalCard";
import EmptyProposals from "./EmptyProposals";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface ProposalsListProps {
  applications: Application[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalsList = ({ 
  applications, 
  isLoading, 
  onUpdateStatus, 
  type 
}: ProposalsListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return <EmptyProposals type={type} />;
  }

  return (
    <motion.div 
      className="grid gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {applications.map((application) => (
        <ProposalCard
          key={application.id}
          application={application}
          type={type}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </motion.div>
  );
};

export default ProposalsList;