import { Card } from "@/components/ui/card";
import ProposalCard from "./ProposalCard";
import { FileSpreadsheet, Send } from "lucide-react";
import { Application } from "@/integrations/supabase/types/opportunity";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProposalsListProps {
  applications: Application[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalsList = ({ applications, isLoading, onUpdateStatus, type }: ProposalsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="p-12">
          <div className="text-center space-y-4">
            {type === 'proposal' ? (
              <>
                <Send className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">No pending invitations</h3>
                <p className="text-gray-500">
                  You don't have any pending project invitations from brands yet.
                  When brands invite you to collaborate, they'll appear here!
                </p>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">No applications submitted</h3>
                <p className="text-gray-500">
                  You haven't applied to any projects yet.
                  Browse available projects and start applying!
                </p>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {applications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
              delay: index * 0.1
            }}
          >
            <ProposalCard
              application={application}
              type={type}
              onUpdateStatus={onUpdateStatus}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProposalsList;