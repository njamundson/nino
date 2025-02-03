import { Application } from "@/integrations/supabase/types/application";
import ProposalCard from "./ProposalCard";
import EmptyProposals from "./EmptyProposals";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

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

  const rowVirtualizer = useVirtualizer({
    count: applications.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimate height of each row
    overscan: 5, // Number of items to render outside of the visible area
  });

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
        style={{
          height: `600px`,
          overflow: 'auto',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const application = applications[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: virtualRow.index * 0.1,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="mb-6"
                >
                  <ProposalCard
                    application={application}
                    type={type}
                    onUpdateStatus={onUpdateStatus}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProposalsList;