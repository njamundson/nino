import { Application } from "@/integrations/supabase/types/application";
import ProposalCard from "./ProposalCard";
import EmptyProposals from "./EmptyProposals";
import { motion, AnimatePresence } from "framer-motion";

interface ProposalsListProps {
  applications: Application[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalsList = ({ 
  applications = [], 
  onUpdateStatus, 
  type 
}: ProposalsListProps) => {
  if (!applications || applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <EmptyProposals type={type} />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="grid gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {applications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            <ProposalCard
              application={application}
              type={type}
              onUpdateStatus={onUpdateStatus}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProposalsList;