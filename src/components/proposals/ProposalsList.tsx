import { Application } from "@/integrations/supabase/types/application";
import ProposalCard from "./ProposalCard";
import EmptyProposals from "./EmptyProposals";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

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
  const parentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const rowVirtualizer = useVirtualizer({
    count: applications.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  useEffect(() => {
    if (!parentRef.current) {
      console.error('Parent ref not found for virtualization');
      toast({
        title: "Display Error",
        description: "There was an error displaying the applications. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
        ref={parentRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6"
        style={{
          height: `600px`,
          overflow: 'auto',
        }}
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